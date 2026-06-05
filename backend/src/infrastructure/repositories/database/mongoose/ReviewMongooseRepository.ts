import Review from "./models/Review.js";

import {IReviewRepository} from "../../../../application/review/IReviewRepository.js";
import {ReviewAdapter} from "./adapters/ReviewAdapter.js";

import {ReviewEntity} from "../../../../entities/review/ReviewEntity.js";
import {ReviewCreatePersistence, ReviewUpdatePersistence} from "../../../../application/types/review.js";
import {RepositoryPaginationResult} from "../../../../application/types/shared.js";

import {EntityAlreadyExistsError, EntityNotFoundError} from "../../../../errors/index.js";

import {determineSort} from "./utils.js";

export class ReviewMongooseRepository extends IReviewRepository {
	async create(productId: string, userId: string, data: ReviewCreatePersistence): Promise<ReviewEntity> {
		try {
			const createdDoc = await Review.create({
				...data,
				product: productId,
				user: userId
			});

			return ReviewAdapter.toEntity(createdDoc);
		}
		catch (error) {
			if (error.code === 11000)
			{
				throw new EntityAlreadyExistsError("Review", { productId, userId });
			}

			throw error;
		}
	}

	async updateByIdAndUserId(reviewId: string, userId: string, data: ReviewUpdatePersistence): Promise<ReviewEntity> {
		const updatedDoc = await Review.findOneAndUpdate(
			{ _id: reviewId, user: userId },
			{ $set: data },
			{ new: true, runValidators: true }
		).lean();

		if (!updatedDoc) {
			throw new EntityNotFoundError("Review", { reviewId, userId });
		}

		return ReviewAdapter.toEntity(updatedDoc);
	}

	async deleteByIdAndUserId(reviewId: string, userId: string): Promise<ReviewEntity> {
		const deletedDoc = await Review.findOneAndDelete({ _id: reviewId, user: userId }).lean();

		if (!deletedDoc) {
			throw new EntityNotFoundError("Review", { reviewId, userId });
		}

		return ReviewAdapter.toEntity(deletedDoc);
	}

	async findByIdAndUserId(reviewId: string, userId: string): Promise<ReviewEntity | null> {
		const foundDoc = await Review.findOne({ _id: reviewId, user: userId }).lean();
		return ReviewAdapter.toEntity(foundDoc);
	}

	async findAndCountByProduct(productId: string, skip: number, limit: number): Promise<RepositoryPaginationResult<ReviewEntity>> {
		const query = { product: productId };
		const sortObject = determineSort("createdAt", "desc");

		const [foundDocs, total] = await Promise.all([
			Review.find(query)
				.sort(sortObject)
				.skip(skip)
				.limit(limit)
				.lean(),
			Review.countDocuments(query),
		]);

		const reviewEntities = foundDocs.map(doc => ReviewAdapter.toEntity(doc));

		return new RepositoryPaginationResult(reviewEntities, total);
	}

	async existsByProductAndUser(productId: string, userId: string): Promise<boolean> {
		return Boolean(await Review.exists({ product: productId, user: userId }));
	}
}