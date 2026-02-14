import {CouponDTO, CouponValidationDTO} from "../../domain/index.js";

/**
 * @interface IProductService
 * @description Agnostic business logic layer for coupon operations.
 */
export class ICouponService {
	/**
	 * Creates a new, unique coupon (a 'GIFT' for a user).
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CouponDTO>} - The newly created coupon DTO.
	 */
	async create(userId) { throw new Error("Method not implemented."); }

	/**
	 * Deactivates an active coupon owned by a specific user.
	 * @param {string} code - The coupon code.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CouponDTO>} - The deactivated coupon DTO.
	 */
	async deactivate(code, userId) { throw new Error("Method not implemented."); }

	/**
	 * Validates a coupon's existence, activity, and expiration date.
	 * @param {string} code - The coupon code.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CouponValidationDTO>} - The coupon validation result DTO.
	 */
	async validate(code, userId) { throw new Error("Method not implemented."); }

	/**
	 * Finds an active coupon owned by a specific user ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CouponDTO | null>} - The found active coupon DTO.
	 */
	async getActiveByUserId(userId) { throw new Error("Method not implemented."); }

	/**
	 * Finds an active coupon by its code and user ID.
	 * @param {string} code - The coupon code.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CouponDTO | null>} - The found active coupon DTO.
	 */
	async getActiveByCodeAndUserId(code, userId) { throw new Error("Method not implemented."); }
}