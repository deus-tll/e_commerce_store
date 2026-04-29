import {CouponValidationDTO} from "../../domain/index.js";

/**
 * @interface ICouponValidator
 * @description Defines the contract for validating coupon operations (e.g., existence,
 * state, user access) and handling necessary state side effects like deactivation.
 */
export class ICouponValidator {
	/**
	 * Validates a coupon's existence, activity, and expiration date.
	 * Handles side effects like deactivating an expired coupon.
	 * @param {string} code - The coupon code.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CouponValidationDTO>} - The coupon validation result DTO.
	 */
	async validate(code, userId) { throw new Error("Method not implemented."); }
}