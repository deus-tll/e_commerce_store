import { ReviewDTO, CreateReviewDTO, ReviewPaginationResultDTO } from "../../domain/index.js";

/**
 * @interface IReviewService
 * @description Contract for business logic related to review operations.
 */
export class IReviewService {
	/**
	 * Creates a new review, checking for existence and product validity.
	 * @param {string} productId - The product ID.
	 * @param {string} userId - The user ID.
	 * @param {CreateReviewDTO} data - The data for the new review.
	 * @returns {Promise<ReviewDTO>} - The newly created review DTO.
	 */
	async create(productId, userId, data) { throw new Error("Method not implemented."); }

	/**
	 * Updates an existing review, ensuring the user is the owner.
	 * @param {string} reviewId - The review ID.
	 * @param {string} userId - The user ID.
	 * @param {UpdateReviewDTO} data - The data for the update review.
	 * @returns {Promise<ReviewDTO>} - The updated review DTO.
	 */
	async update(reviewId, userId, data) { throw new Error("Method not implemented."); }

	/**
	 * Deletes an existing review, ensuring the user is the owner.
	 * @param {string} userId - The user ID.
	 * @param {string} reviewId - The review ID.
	 * @returns {Promise<ReviewDTO>} - The deleted review DTO.
	 */
	async delete(userId, reviewId) { throw new Error("Method not implemented."); }

	/**
	 * Gets a paginated list of reviews for a specific product.
	 * @param {string} productId - The product ID.
	 * @param {number} [page] - The page number.
	 * @param {number} [limit] - The maximum number of documents per page.
	 * @returns {Promise<ReviewPaginationResultDTO>} - The paginated list of reviews.
	 */
	async getAllByProduct(productId, page, limit) { throw new Error("Method not implemented."); }
}