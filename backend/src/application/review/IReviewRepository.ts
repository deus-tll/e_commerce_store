import {ReviewEntity} from "../../entities/review/ReviewEntity.js";
import {ReviewCreatePersistence, ReviewUpdatePersistence} from "../types/review.js";
import {RepositoryPaginationResult} from "../types/shared.js";

export abstract class IReviewRepository {
	abstract create(productId: string, userId: string, data: ReviewCreatePersistence): Promise<ReviewEntity>;
	abstract updateByIdAndUserId(reviewId: string, userId: string, data: ReviewUpdatePersistence): Promise<ReviewEntity>;
	abstract deleteByIdAndUserId(reviewId: string, userId: string): Promise<ReviewEntity>;
	abstract findByIdAndUserId(reviewId: string, userId: string): Promise<ReviewEntity | null>;
	abstract findAndCountByProduct(
		productId: string,
		skip: number,
		limit: number
	): Promise<RepositoryPaginationResult<ReviewEntity>>;
	abstract existsByProductAndUser(productId: string, userId: string): Promise<boolean>;
}