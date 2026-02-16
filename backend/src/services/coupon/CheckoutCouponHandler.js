import {ICouponHandler} from "../../interfaces/coupon/ICouponHandler.js";
import {ICouponService} from "../../interfaces/coupon/ICouponService.js";
import {config} from "../../config.js";

/**
 * @augments ICouponHandler
 * @description Handles all business logic related to coupon application and eligibility
 * during the initial stage of a checkout session.
 */
export class CheckoutCouponHandler extends ICouponHandler {
	/** @type {ICouponService} */ #couponService;

	/**
	 * @param {ICouponService} couponService
	 */
	constructor(couponService) {
		super();
		this.#couponService = couponService;
	}

	async applyDiscount(initialTotalAmount, couponCode, userId) {
		// 1. Check if a coupon code was provided
		if (!couponCode) {
			return { totalAmount: initialTotalAmount, appliedCoupon: null };
		}

		// 2. Retrieve the active coupon from the database
		const coupon = await this.#couponService.getActiveByCodeAndUserId(couponCode, userId);

		// 3. If the coupon is invalid/expired/not found, proceed without a discount
		if (!coupon) {
			return { totalAmount: initialTotalAmount, appliedCoupon: null };
		}

		// 4. Calculate discount (in cents)
		const discount = Math.round((initialTotalAmount * coupon.discountPercentage) / 100);
		const totalAmount = initialTotalAmount - discount;

		return { totalAmount, appliedCoupon: coupon };
	}

	async grantNewCouponIfEligible(userId, amountPaidInCents) {
		// Check if the purchase meets the minimum threshold
		if (amountPaidInCents < config.coupon.amountForGrantingCoupon) return;

		const couponDTO = await this.#couponService.create(userId);

		if (!couponDTO) {
			console.error("Failed to create coupon.");
		}
	}
}