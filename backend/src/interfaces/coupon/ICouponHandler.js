import { CouponDTO } from "../../domain/index.js";

/**
 * @interface
 * @description Defines the contract for applying coupon business rules and managing
 * coupon grant eligibility during the checkout flow.
 */
export class ICouponHandler {
	/**
	 * Calculates the final amount after applying a coupon, fetching the coupon details if available.
	 * @param {number} initialTotalAmount - Total cost before discount (in cents).
	 * @param {string | undefined} couponCode
	 * @param {string} userId
	 * @returns {Promise<{ totalAmount: number, appliedCoupon: CouponDTO | null }>}
	 */
	async applyDiscount(initialTotalAmount, couponCode, userId) { throw new Error("Method not implemented."); }

	/**
	 * Fire-and-forget logic to grant a new coupon if the initial purchase was large enough.
	 * @param {string} userId
	 * @param {number} initialTotalAmount
	 * @returns {void}
	 */
	async grantNewCouponIfEligible(userId, initialTotalAmount) { throw new Error("Method not implemented."); }
}