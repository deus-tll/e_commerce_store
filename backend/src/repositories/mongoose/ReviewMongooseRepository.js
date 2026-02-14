import Review from "../../models/mongoose/Review.js";

import {IReviewRepository} from "../../interfaces/repositories/IReviewRepository.js";
import {RepositoryPaginationResult} from "../../domain/index.js";

import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {BadRequestError} from "../../errors/apiErrors.js";

export class ReviewMongooseRepository extends IReviewRepository {
	async create(productId, userId, data) {
		try {
			const createdDoc = await Review.create({
				data,
				product: productId,
				user: userId
			});

			return MongooseAdapter.toReviewEntity(createdDoc);
		}
		catch (error) {
			if (error.code === 11000)
			{
				throw new BadRequestError("You have already reviewed this product");
			}

			throw error;
		}
	}

	async updateByIdAndUserId(reviewId, userId, data) {
		const updatedDoc = await Review.findOneAndUpdate(
			{ _id: reviewId, user: userId },
			{ $set: data },
			{ new: true, runValidators: true }
		).lean();

		return MongooseAdapter.toReviewEntity(updatedDoc);
	}

	async deleteByIdAndUserId(reviewId, userId) {
		const deletedDoc = await Review.findOneAndDelete({ _id: reviewId, user: userId }).lean();
		return MongooseAdapter.toReviewEntity(deletedDoc);
	}

	async findByIdAndUserId(reviewId, userId) {
		const foundDoc = await Review.findOne({ _id: reviewId, user: userId }).lean();
		return MongooseAdapter.toReviewEntity(foundDoc);
	}

	async findAndCountByProduct(productId, skip, limit, options = {}) {
		const query = { product: productId };

		const [foundDocs, total] = await Promise.all([
			Review.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			Review.countDocuments(query),
		]);

		const reviewEntities = foundDocs.map(doc => MongooseAdapter.toReviewEntity(doc));

		return new RepositoryPaginationResult(reviewEntities, total);
	}
}