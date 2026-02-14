import {CouponEntity} from "../../domain/index.js";

/**
 * @interface ICouponRepository
 * @description Contract for working with coupon data in the persistence layer.
 */
export class ICouponRepository {
	/**
	 * Creates and saves a new coupon record.
	 * @param {Object} data - The data for the new coupon.
	 * @returns {Promise<CouponEntity>} - The newly created coupon record.
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates a coupon by its code and owning user ID.
	 * @param {string} couponCode - The coupon code.
	 * @param {string} userId - The user ID.
	 * @param {boolean} isActive - The value.
	 * @returns {Promise<CouponEntity>} - The updated coupon record.
	 */
	async updateCouponActiveState(couponCode, userId, isActive) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a coupon entity by the owning user ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CouponEntity | null>} - The deleted coupon record.
	 */
	async deleteByUserId(userId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a coupon by its code and user ID.
	 * @param {string} code - The coupon code.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CouponEntity | null>} - The found coupon record.
	 */
	async findByCodeAndUserId(code, userId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds an active coupon by user ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CouponEntity | null>} - The found active coupon record.
	 */
	async findActiveByUserId(userId) {
		throw new Error("Method not implemented.");
	}
}