/**
 * @interface IReviewValidator
 * @description Defines the contract for validating dependencies necessary
 * for Review domain operations.
 */
export class IReviewValidator {
	/**
	 * Checks if the required Product and User exist before creating a new review
	 * as well as other business rules for creating review.
	 * Throws exception if either ID is invalid.
	 * @param {string} productId
	 * @param {string} userId
	 * @returns {Promise<void>}
	 */
	async validateCreation(productId, userId) { throw new Error("Method not implemented."); }
}