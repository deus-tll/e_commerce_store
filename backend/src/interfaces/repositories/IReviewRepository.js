import { ReviewEntity, CreateReviewDTO, UpdateReviewDTO, RepositoryPaginationResult } from "../../domain/index.js";

/**
 * @interface IReviewRepository
 * @description Contract for working with review data in the persistence layer.
 */
export class IReviewRepository {
	/**
	 * Creates and saves a new review record.
	 * @param {CreateReviewDTO} data - The data for the new review.
	 * @returns {Promise<ReviewEntity>} - The newly created review record.
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates a review entity by its ID and user ID.
	 * @param {UpdateReviewDTO} data - The data for the update review.
	 * @returns {Promise<ReviewEntity | null>} - The updated review record.
	 */
	async updateByIdAndUserId(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a review entity by its ID and user ID.
	 * @param {string} reviewId - The review ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<ReviewEntity | null>} - The deleted review record.
	 */
	async deleteByIdAndUserId(reviewId, userId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a review entity by its ID and user ID for ownership check.
	 * @param {string} reviewId - The review ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<ReviewEntity | null>} - The found review record.
	 */
	async findByIdAndUserId(reviewId, userId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds reviews and their total count for pagination, filtered by product ID.
	 * @param {string} productId - The product ID.
	 * @param {number} skip - The number of documents to skip.
	 * @param {number} limit - The maximum number of documents to return.
	 * @param {object} [options] - Options like population paths.
	 * @returns {Promise<RepositoryPaginationResult<ReviewEntity>>} - The paginated results.
	 */
	async findAndCountByProduct(productId, skip, limit, options) {
		throw new Error("Method not implemented.");
	}
}