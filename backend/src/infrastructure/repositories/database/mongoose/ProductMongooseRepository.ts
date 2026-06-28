import mongoose, {FilterQuery, PipelineStage} from "mongoose";
import Product, {IProductDoc} from "./models/Product.js";

import {IProductRepository} from "../../../../application/product/IProductRepository.js";
import {ProductAdapter} from "./adapters/ProductAdapter.js";

import {ProductEntity} from "../../../../entities/product/ProductEntity.js";
import {OrderProductItem} from "../../../../entities/order/types/OrderProductItem.js";
import {
	AttributeFacetDTO,
	ProductCountFilters,
	ProductCreatePersistence,
	ProductFiltersPersistence,
	ProductUpdatePersistence
} from "../../../../application/types/product.js";
import {RepositoryPaginationResult} from "../../../../application/types/shared.js";

import {EntityNotFoundError} from "../../../../errors/index.js";
import {InsufficientStockError} from "../../../../errors/InsufficientStockError.js";

import {sanitizeSearchTerm} from "../../../../utils/sanitize.js";
import {determineSort, toObjectId} from "./utils.js";

export class ProductMongooseRepository extends IProductRepository {
	private toEntityOrThrow(doc?: IProductDoc | null, criteria: any = {}): ProductEntity {
		const entity = ProductAdapter.toEntity(doc);

		if (!entity) throw new EntityNotFoundError("Product", criteria);

		return entity;
	}

	private buildQuery(filters: ProductFiltersPersistence): FilterQuery<IProductDoc> {
		const { categoryId, attributes } = filters;

		return {
			...(categoryId && { category: toObjectId(categoryId, "Category")}),
			...(attributes && Object.keys(attributes).length > 0 && {
				$and: Object.entries(attributes).map(([name, value]) => {
					const matchValue = Array.isArray(value) ? {$in: value} : value;

					return {
						attributes: {
							$elemMatch: {name, value: matchValue}
						}
					};
				})
			}),
		};
	}

	async create(data: ProductCreatePersistence): Promise<ProductEntity> {
		const persistenceDoc = ProductAdapter.toCreatePersistenceDoc(data);
		const createdDoc = await Product.create(persistenceDoc);
		return ProductAdapter.toEntityRequired(createdDoc);
	}

	async updateById(id: string, data: ProductUpdatePersistence): Promise<ProductEntity> {
		const persistenceDoc = ProductAdapter.toUpdatePersistenceDoc(data);

		const updatedDoc = await Product.findByIdAndUpdate(
			id,
			persistenceDoc,
			{ new: true, runValidators: true }
		).lean();

		return this.toEntityOrThrow(updatedDoc, { id });
	}

	async toggleFeatured(id: string): Promise<ProductEntity> {
		const updatedDoc = await Product.findByIdAndUpdate(
			id,
			[
				{
					$set: {
						isFeatured: { $not: "$isFeatured" }
					}
				}
			],
			{ new: true, useFindAndModify: false }
		).lean();

		return this.toEntityOrThrow(updatedDoc, { id });
	}

	async deductStock(productItems: readonly OrderProductItem[]): Promise<void> {
		const productItemsLength = productItems.length;

		if (productItemsLength === 0) return;

		const updateOperations = productItems.map((productItem) => {
			const { id, quantity } = productItem;

			return {
				updateOne: {
					filter: {
						_id: id,
						stock: { $gte: quantity  },
					},
					update: {
						$inc: { stock: -quantity }
					}
				}
			}
		});

		const updateResult = await Product.bulkWrite(updateOperations);

		const modifiedCount = updateResult.modifiedCount;

		if (modifiedCount < productItemsLength) {
			throw new InsufficientStockError(`Only ${modifiedCount} of ${productItemsLength} items could be deducted.`)
		}
	}

	async updateRatingStats(productId: string, ratingChange: number, totalReviewsChange: number, oldRating: number = 0): Promise<void> {
		const ratingSumDelta = ratingChange - oldRating;

		const updatedProduct = await Product.findByIdAndUpdate(
			productId,
			[
				{
					// Stage 1: Atomically update ratingSum and totalReviews using $add
					$set: {
						"ratingStats.ratingSum": {
							$max: [
								0,
								{ $add: [{ $ifNull: ["$ratingStats.ratingSum", 0] }, ratingSumDelta] }
							]
						},
						"ratingStats.totalReviews": {
							$max: [
								0,
								{ $add: [{ $ifNull: ["$ratingStats.totalReviews", 0] }, totalReviewsChange] }
							]
						}
					}
				},
				{
					// Stage 2: Recalculate averageRating based on the new totals
					$set: {
						"ratingStats.averageRating": {
							$cond: {
								// Prevent division by zero if totalReviews is 0
								if: { $lte: ["$ratingStats.totalReviews", 0] },
								then: 0,
								else: { $divide: ["$ratingStats.ratingSum", "$ratingStats.totalReviews"] }
							}
						}
					}
				}
			],
			{ new: true, runValidators: true },
		).lean();

		if (!updatedProduct) throw new EntityNotFoundError("Product", { id: productId });
	}

	async deleteById(id: string): Promise<ProductEntity> {
		const deletedDoc = await Product.findByIdAndDelete(id).lean();
		return this.toEntityOrThrow(deletedDoc, { id });
	}

	async findById(id: string): Promise<ProductEntity | null> {
		const foundDoc = await Product.findById(id).lean();
		return ProductAdapter.toEntity(foundDoc);
	}

	async findAndCount(
		filters: ProductFiltersPersistence,
		skip: number,
		limit: number
	): Promise<RepositoryPaginationResult<ProductEntity>> {
		const { search, sortBy = "createdAt", order = "desc", ...queryFilters } = filters;

		const isComplexQuery = !!search;
		const query = this.buildQuery(queryFilters);

		const sortObject = determineSort(sortBy, order);

		// --- 1. Simple Find Path (No Search Query) ---
		if (!isComplexQuery) {
			const [foundDocs, calculatedTotal] = await Promise.all([
				Product.find(query)
					.sort(sortObject)
					.skip(skip)
					.limit(limit)
					.lean(),

				Product.countDocuments(query),
			]);

			const productEntities = foundDocs.map(doc => ProductAdapter.toEntityRequired(doc));
			return new RepositoryPaginationResult(productEntities, calculatedTotal);
		}

		// --- 2. Complex Search Path (Aggregation) ---
		const sanitizedTerm = sanitizeSearchTerm(filters.search);
		const searchRegex = new RegExp(sanitizedTerm, 'i');
		const basePipeline: PipelineStage[] = [];

		// A. Initial Match (for category filtering, if present)
		if (Object.keys(query).length > 0) {
			basePipeline.push({ $match: query });
		}

		basePipeline.push(
			{
				// B. Lookup/Join the Category to access its name
				$lookup: {
					from: 'categories',
					localField: 'category',
					foreignField: '_id',
					as: 'categoryDetails'
				}
			},

			// C. Unwind the categoryDetails array to treat it as a single object
			{ $unwind: '$categoryDetails' },

			// D. Search Match: Apply the search across product name OR category name
			{
				$match: {
					$or: [
						{ name: { $regex: searchRegex } }, // Search product name
						{ 'categoryDetails.name': { $regex: searchRegex } } // Search category name
					]
				}
			}
		);

		// E. Total Count Calculation (run this pipeline up to this point)
		const [totalResult] = await Product.aggregate([
			...basePipeline,
			{ $count: "total" }
		]);
		const calculatedTotal = totalResult ? totalResult.total : 0;

		const documentsPipeline: PipelineStage[] = [
			...basePipeline,

			// F. Final Steps: Sort, Skip, Limit, and Project (for Entity conversion)
			{ $sort: sortObject },
			{ $skip: skip },
			{ $limit: limit },

			// Project only the necessary fields for #toEntity conversion (excluding categoryDetails)
			{
				$project: {
					_id: 1, name: 1, description: 1, price: 1, stock: 1, images: 1, category: 1,
					attributes: 1, isFeatured: 1, ratingStats: 1, createdAt: 1, updatedAt: 1
				}
			}
		];

		const foundDocs = await Product.aggregate(documentsPipeline);
		const productEntities = foundDocs.map(doc => ProductAdapter.toEntityRequired(doc));

		return new RepositoryPaginationResult(productEntities, calculatedTotal);
	}

	async count(filters: ProductCountFilters = {}): Promise<number> {
		const baseQuery = this.buildQuery(filters);
		return Product.countDocuments(baseQuery);
	}

	async findByIds(ids: string[]): Promise<ProductEntity[]> {
		const foundDocs = await Product.find({ _id: { $in: ids } }).lean();
		return foundDocs.map(doc => ProductAdapter.toEntityRequired(doc));
	}

	async findByFeaturedStatus(isFeatured: boolean): Promise<ProductEntity[]> {
		const foundDocs = await Product.find({ isFeatured }).lean();
		return foundDocs.map(doc => ProductAdapter.toEntityRequired(doc));
	}

	async exists(id: string): Promise<boolean> {
		return Boolean(await Product.exists({ _id: id }));
	}

	async getAttributeFacets(categoryId: string): Promise<AttributeFacetDTO[]> {
		const pipeline: PipelineStage[] = [
			// 1. Filter products by the specific category ID
			{ $match: { category: new mongoose.Types.ObjectId(categoryId) } },

			// 2. Break down the attributes array into individual documents
			{ $unwind: "$attributes" },

			// 3. Group by attribute name and collect unique values into an array
			{
				$group: {
					_id: "$attributes.name",
					uniqueValues: { $addToSet: "$attributes.value" }
				}
			},

			// 4. Project into a clean structure for the frontend
			{
				$project: {
					_id: 0,
					name: "$_id",
					values: "$uniqueValues"
				}
			},

			// 5. Sort attribute groups alphabetically
			{ $sort: { name: 1 } }
		];

		const results = await Product.aggregate(pipeline);

		return results.map(row => {
			const valuesArray = (row.values || []) as string[];
			const sortedValues = valuesArray.sort((a, b) =>
				a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
			);

			return new AttributeFacetDTO(row.name, sortedValues);
		});
	}


	async markAsFeaturedRatingBased(minRating: number): Promise<void> {
		await Product.updateMany(
			{ "ratingStats.averageRating": { $gte: minRating } },
			{ $set: { isFeatured: true } },
		);
	}

	async findByCategoryIdsExcludingProductIds(
		size: number,
		categoryIds: string[] = [],
		excludedIds: string[] = []
	): Promise<ProductEntity[]> {
		const match: FilterQuery<IProductDoc> = {};

		if (categoryIds.length > 0) {
			match.category = { $in: categoryIds.map(id => new mongoose.Types.ObjectId(id)) };
		}

		if (excludedIds.length > 0) {
			match._id = { $nin: excludedIds.map(id => new mongoose.Types.ObjectId(id)) };
		}

		const pipeline: PipelineStage[] = [
			{ $match: Object.keys(match).length > 0 ? match : { _id: { $exists: true } } },
			{ $sample: { size: size } },
			{ $project: { _id: 1, name: 1, description: 1, price: 1, stock: 1, images: 1, category: 1, ratingStats: 1 } }
		];

		const foundDocs = await Product.aggregate(pipeline);
		return foundDocs.map(doc => ProductAdapter.toEntityRequired(doc));
	}
}