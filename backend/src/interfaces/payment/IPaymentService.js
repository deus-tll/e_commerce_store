import {OrderProductItem, CheckoutSessionDTO, CheckoutSuccessDTO} from "../../domain/index.js";

/**
 * @interface IPaymentService
 * @description Contract for handling external payment processing, regardless of vendor (Stripe, PayPal, etc.).
 */
export class IPaymentService {
	/**
	 * Creates a new payment checkout session for a list of products.
	 * @param {OrderProductItem[]} products - Array of products to purchase.
	 * @param {string} [couponCode] - Optional coupon code to apply.
	 * @param {string} userId - ID of the user creating the session.
	 * @returns {Promise<CheckoutSessionDTO>} - The newly created checkout session DTO.
	 */
	async createCheckoutSession(products, couponCode, userId) { throw new Error("Method not implemented."); }

	/**
	 * Confirms a successful payment session based on a session ID, creates an Order record, and manages used coupons.
	 * Ensures idempotency by checking for existing orders linked to the session.
	 * @param {string} sessionId - The platform-specific ID of the completed payment session.
	 * @returns {Promise<CheckoutSuccessDTO>} - The success DTO containing the new order ID.
	 */
	async checkoutSuccess(sessionId) { throw new Error("Method not implemented."); }
}