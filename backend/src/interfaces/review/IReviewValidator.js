/**
 * @interface IReviewValidator
 * @description Defines the contract for validating dependencies necessary
 * for Review domain operations (e.g., existence checks).
 */
export class IReviewValidator {
	/**
	 * Checks if the required Product and User exist before creating a new review.
	 * Throws exception if either ID is invalid.
	 * @param {string} productId - The ID of the product being reviewed.
	 * @param {string} userId - The ID of the user creating the review.
	 * @returns {Promise<void>}
	 */
	async validateCreation(productId, userId) { throw new Error("Method not implemented."); }

	/**
	 * Checks if the required Product exists.
	 * Throws exception if the ID is invalid.
	 * @param {string} productId - The ID of the product.
	 * @returns {Promise<void>}
	 */
	async validateProductExistence(productId) { throw new Error("Method not implemented."); }
}