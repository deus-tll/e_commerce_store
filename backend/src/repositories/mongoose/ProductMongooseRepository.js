import Product from "../../models/mongoose/Product.js";

import {IProductRepository} from "../../interfaces/repositories/IProductRepository.js";
import {RepositoryPaginationResult} from "../../domain/index.js";

import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {BadRequestError, NotFoundError} from "../../errors/apiErrors.js";

export class ProductMongooseRepository extends IProductRepository {
	#buildMongooseQuery(query) {
		const mongooseQuery = {};

		if (query.categoryId) {
			mongooseQuery.category = query.categoryId;
		}

		return mongooseQuery;
	}

	async create(data) {
		const docData = {
			name: data.name,
			description: data.description,
			price: data.price,
			images: data.images,
			category: data.categoryId,
			isFeatured: data.isFeatured,
		};

		const createdDoc = await Product.create(docData);

		return MongooseAdapter.toProductEntity(createdDoc);
	}

	async updateById(id, data) {
		const agnosticUpdate = data.toUpdateObject();
		const mongooseUpdate = { $set: {} };

		if (agnosticUpdate.categoryId !== undefined) {
			mongooseUpdate.$set.category = agnosticUpdate.categoryId;
			delete agnosticUpdate.categoryId;
		}

		Object.assign(mongooseUpdate.$set, agnosticUpdate);

		if (Object.keys(mongooseUpdate.$set).length === 0) {
			throw new BadRequestError("Nothing to update");
		}

		const updateOptions = { new: true, runValidators: true };

		const updatedDoc = await Product.findByIdAndUpdate(
			id,
			mongooseUpdate,
			updateOptions
		).lean();

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
			throw new NotFoundError("Updated product not found");
		}

		return MongooseAdapter.toProductEntity(updatedDoc);
	}

	async updateRatingStats(productId, ratingChange, totalReviewsChange, oldRating = 0) {
		const ratingSumDelta = ratingChange - oldRating;

		await Product.findByIdAndUpdate(
			productId,
			[
				{
					// Stage 1: Atomically update ratingSum and totalReviews using $add
					$set: {
						"ratingStats.ratingSum": { $add: ["$ratingStats.ratingSum", ratingSumDelta] },
						"ratingStats.totalReviews": { $add: ["$ratingStats.totalReviews", totalReviewsChange] },
					}
				},
				{
					// Stage 2: Recalculate averageRating based on the new totals
					$set: {
						"ratingStats.averageRating": {
							$cond: {
								// Prevent division by zero if totalReviews is 0
								if: { $eq: ["$ratingStats.totalReviews", 0] },
								then: 0,
								else: { $divide: ["$ratingStats.ratingSum", "$ratingStats.totalReviews"] }
							}
						}
					}
				}
			],
			{ new: false, useFindAndModify: false },
		);
	}

	async deleteById(id) {
		const deletedDoc = await Product.findByIdAndDelete(id).lean();
		return MongooseAdapter.toProductEntity(deletedDoc);
	}

	async findById(id) {
		const foundDoc = await Product.findById(id).lean();
		return MongooseAdapter.toProductEntity(foundDoc);
	}

	async findAndCount(query, skip, limit, sort = { createdAt: -1 }) {
		const isComplexQuery = query.search;

		const mongooseQuery = this.#buildMongooseQuery(query);

		// --- 1. Simple Find Path (No Search Query) ---
		// If only pagination or simple category filter, use simple find for better performance
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
		const searchRegex = new RegExp(query.search, 'i');
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
				_id: 1, name: 1, description: 1, price: 1, images: 1, category: 1,
				isFeatured: 1, createdAt: 1, updatedAt: 1
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

	async findRecommended(size) {
		const foundDocs = await Product.aggregate([
			{$sample: {size: size}},
			{$project: {_id: 1, name: 1, description: 1, price: 1, images: 1, category: 1}}
		]);

		return foundDocs.map(doc => MongooseAdapter.toProductEntity(doc));
	}

	async existsById(id) {
		const count = await Product.countDocuments({ _id: id });
		return count > 0;
	}
}