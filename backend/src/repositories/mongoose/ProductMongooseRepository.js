import mongoose from "mongoose";
import Product from "../../models/mongoose/Product.js";

import {IProductRepository} from "../../interfaces/repositories/IProductRepository.js";
import {AttributeFacetDTO, RepositoryPaginationResult} from "../../domain/index.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {EntityNotFoundError} from "../../errors/index.js";

import {sanitizeSearchTerm} from "../../utils/sanitize.js";

export class ProductMongooseRepository extends IProductRepository {
	#buildMongooseQuery(query) {
		const mongooseQuery = {};

		if (query.categoryId) {
			mongooseQuery.category = query.categoryId;
		}

		if (query.attributes && Object.keys(query.attributes).length > 0) {
			mongooseQuery.$and = Object.entries(query.attributes).map(([name, value]) => {
				const matchValue = Array.isArray(value) ? { $in: value } : value;

				return {
					attributes: {
						$elemMatch: { name, value: matchValue }
					}
				};
			});
		}

		return mongooseQuery;
	}

	async create(data) {
		const { categoryId, ...rest } = data;

		const createdDoc = await Product.create({
			...rest,
			category: categoryId
		});

		return MongooseAdapter.toProductEntity(createdDoc);
	}

	async updateById(id, data) {
		const { categoryId, ...rest } = { ...data };
		let updateData = { ...rest };

		if (categoryId) {
			updateData.category = categoryId;
		}

		const updatedDoc = await Product.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true }
		).lean();

		if (!updatedDoc) {
			throw new EntityNotFoundError("Product", { id });
		}

		return MongooseAdapter.toProductEntity(updatedDoc);
	}

	async toggleFeatured(id) {
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

		if (!updatedDoc) {
			throw new EntityNotFoundError("Product", { id });
		}

		return MongooseAdapter.toProductEntity(updatedDoc);
	}

	async updateRatingStats(productId, ratingChange, totalReviewsChange, oldRating = 0) {
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
		);

		if (!updatedProduct) throw new EntityNotFoundError("Product", { id: productId });

		return updatedProduct;
	}

	async deleteById(id) {
		const deletedDoc = await Product.findByIdAndDelete(id).lean();

		if (!deletedDoc) throw new EntityNotFoundError("Product", { id });

		return MongooseAdapter.toProductEntity(deletedDoc);
	}

	async findById(id) {
		const foundDoc = await Product.findById(id).lean();
		return MongooseAdapter.toProductEntity(foundDoc);
	}

	async findAndCount(query, skip, limit, options = {}) {
		const { sortBy = "createdAt", order = "desc" } = options;

		const isComplexQuery = !!query.search;
		const mongooseQuery = this.#buildMongooseQuery(query);

		const sortOrder = order === "desc" ? -1 : 1;
		const sort = { [sortBy]: sortOrder };

		// --- 1. Simple Find Path (No Search Query) ---
		if (!isComplexQuery) {
			const [foundDocs, calculatedTotal] = await Promise.all([
				Product.find(mongooseQuery)
					.sort(sort)
					.skip(skip)
					.limit(limit)
					.lean(),

				Product.countDocuments(mongooseQuery),
			]);

			const productEntities = foundDocs.map(doc => MongooseAdapter.toProductEntity(doc));
			return new RepositoryPaginationResult(productEntities, calculatedTotal);
		}

		// --- 2. Complex Search Path (Aggregation) ---
		const sanitizedTerm = sanitizeSearchTerm(query.search);
		const searchRegex = new RegExp(sanitizedTerm, 'i');
		const pipeline = [];

		// A. Initial Match (for category filtering, if present)
		if (Object.keys(mongooseQuery).length > 0) {
			pipeline.push({ $match: mongooseQuery });
		}

		// B. Lookup/Join the Category to access its name
		pipeline.push({
			$lookup: {
				from: 'categories',
				localField: 'category',
				foreignField: '_id',
				as: 'categoryDetails'
			}
		});

		// C. Unwind the categoryDetails array to treat it as a single object
		pipeline.push({ $unwind: '$categoryDetails' });

		// D. Search Match: Apply the search across product name OR category name
		pipeline.push({
			$match: {
				$or: [
					{ name: { $regex: searchRegex } }, // Search product name
					{ 'categoryDetails.name': { $regex: searchRegex } } // Search category name
				]
			}
		});

		// E. Total Count Calculation (run this pipeline up to this point)
		const [totalResult] = await Product.aggregate([
			...pipeline,
			{ $count: "total" }
		]);
		const calculatedTotal = totalResult ? totalResult.total : 0;

		// F. Final Steps: Sort, Skip, Limit, and Project (for Entity conversion)
		pipeline.push({ $sort: sort });
		pipeline.push({ $skip: skip });
		pipeline.push({ $limit: limit });

		// Project only the necessary fields for #toEntity conversion (excluding categoryDetails)
		pipeline.push({
			$project: {
				_id: 1, name: 1, description: 1, price: 1, stock: 1, images: 1, category: 1,
				attributes: 1, isFeatured: 1, ratingStats: 1, createdAt: 1, updatedAt: 1
			}
		});

		const foundDocs = await Product.aggregate(pipeline);
		const productEntities = foundDocs.map(doc => MongooseAdapter.toProductEntity(doc));

		return new RepositoryPaginationResult(productEntities, calculatedTotal);
	}

	async count(query = {}) {
		const baseQuery = this.#buildMongooseQuery(query);
		return await Product.countDocuments(baseQuery);
	}

	async findByIds(ids) {
		const foundDocs = await Product.find({ _id: { $in: ids } }).lean();
		return foundDocs.map(doc => MongooseAdapter.toProductEntity(doc));
	}

	async findByFeaturedStatus(isFeatured) {
		const foundDocs = await Product.find({ isFeatured }).lean();
		return foundDocs.map(doc => MongooseAdapter.toProductEntity(doc));
	}

	async getAttributeFacets(categoryId) {
		const pipeline = [
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
			const sortedValues = (row.values || []).sort((a, b) =>
				a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
			);

			return new AttributeFacetDTO(row.name, sortedValues);
		});
	}

	async findRecommended(size) {
		const foundDocs = await Product.aggregate([
			{$sample: {size: size}},
			{$project:
					{
						_id: 1, name: 1, description: 1, price: 1, stock: 1, images: 1, category: 1, ratingStats: 1
					}
			}
		]);

		return foundDocs.map(doc => MongooseAdapter.toProductEntity(doc));
	}

	async existsById(id) {
		const count = await Product.countDocuments({ _id: id });
		return count > 0;
	}
}