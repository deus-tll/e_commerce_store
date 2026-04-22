import {OrderProductItem} from "../../domain/index.js";

/**
 * @interface IStripeProvider
 * @description Contract for all direct interactions with the external Stripe API.
 * Ensures the main payment service logic is decoupled from Stripe's implementation details.
 */
export class IStripeProvider {
	/**
	 * Converts the generic applied coupon data into the payment provider's
	 * specific discount data structure (e.g., Stripe Discount Objects).
	 * @param {object | null} appliedCoupon - The generic coupon object returned by ICouponHandler.
	 * @returns {Promise<Array>} - Provider-specific discount array (e.g., [{ coupon: 'ID' }]).
	 */
	async prepareDiscountsForProvider(appliedCoupon) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Converts a list of domain products into Stripe-specific line items
	 * and calculates the initial total amount.
	 * @param {OrderProductItem[]} products - Array of domain product items.
	 * @returns {{ lineItems: Array, initialTotalAmount: number }}
	 */
	processProductsForStripe(products) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Creates a new Stripe Checkout Session.
	 * @param {Array} lineItems - Products formatted for Stripe.
	 * @param {Array} stripeDiscounts - Stripe-specific discount objects (using Coupon IDs).
	 * @param {string} userId - ID of the user creating the session.
	 * @param {string} couponCode - The coupon code used (or empty string).
	 * @param {string} orderId - Order ID.
	 * @returns {Promise<object>} The raw Stripe Session object.
	 */
	async createCheckoutSession(lineItems, stripeDiscounts, userId, couponCode, orderId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Verifies the Stripe signature and constructs the event object.
	 * @param {Buffer} payload
	 * @param {object} headers
	 * @returns {object} Verified Stripe event.
	 */
	constructEvent(payload, headers) {
		throw new Error("Method not implemented.");
	}
}