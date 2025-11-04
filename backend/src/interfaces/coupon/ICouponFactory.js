import {CreateCouponDTO} from "../../domain/index.js";

/**
 * @interface ICouponFactory
 * @description Defines the contract for assembling and generating all necessary
 * data/utilities for creating a Coupon, including code and expiration.
 */
export class ICouponFactory {
	/**
	 * Creates a complete CreateCouponDTO, including a unique code and expiration date.
	 * @param {string} userId - The user ID to associate with the coupon.
	 * @returns {CreateCouponDTO}
	 */
	createDTO(userId) { throw new Error("Method not implemented."); }
}