/**
 * @interface IProductStatsService
 * @description Interface for managing the statistical aggregation of product data based on review changes.
 */
export class IProductStatsService {
	/**
	 * Handles the statistical updates when a new review is created.
	 * @param {string} productId - The ID of the product being reviewed.
	 * @param {number} newRating - The rating given by the new review.
	 * @returns {Promise<void>}
	 */
	async handleReviewCreation(productId, newRating) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Handles the statistical updates when an existing review is updated.
	 * @param {string} productId - The ID of the product.
	 * @param {number} newRating - The new rating value.
	 * @param {number} oldRating - The previous rating value.
	 * @returns {Promise<void>}
	 */
	async handleReviewUpdate(productId, newRating, oldRating) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Handles the statistical updates when a review is deleted.
	 * @param {string} productId - The ID of the product.
	 * @param {number} oldRating - The rating of the deleted review (needed for subtraction).
	 * @returns {Promise<void>}
	 */
	async handleReviewDeletion(productId, oldRating) {
		throw new Error("Method not implemented.");
	}
}