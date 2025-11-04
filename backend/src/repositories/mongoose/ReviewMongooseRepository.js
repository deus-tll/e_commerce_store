import Review from "../../models/mongoose/Review.js";

import {IReviewRepository} from "../../interfaces/repositories/IReviewRepository.js";
import {RepositoryPaginationResult} from "../../domain/index.js";

import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {BadRequestError} from "../../errors/apiErrors.js";

export class ReviewMongooseRepository extends IReviewRepository {
	async create(data) {
		try {
			const createdDoc = await Review.create({
				product: data.productId,
				user: data.userId,
				rating: data.rating,
				comment: data.comment,
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

	async updateByIdAndUserId(data) {
		const $set = data.toUpdateObject();

		if (Object.keys($set).length === 0) {
			throw new BadRequestError("Nothing to update");
		}

		const updateOptions = { new: true, runValidators: true };

		const updatedDoc = await Review.findOneAndUpdate(
			{ _id: data.reviewId, user: data.userId },
			{ $set },
			updateOptions
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