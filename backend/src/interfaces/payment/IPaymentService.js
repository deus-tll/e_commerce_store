import {CheckoutSessionDTO} from "../../domain/index.js";

/**
 * @interface IPaymentService
 * @description Contract for handling external payment processing, regardless of vendor (Stripe, PayPal, etc.).
 */
export class IPaymentService {
	/**
	 * Creates a new payment checkout session for a list of products.
	 * @param {[{id, quantity}]} products - Array of products to purchase.
	 * @param {string} [couponCode] - Optional coupon code to apply.
	 * @param {string} userId - ID of the user creating the session.
	 * @param {object} customerDetails - Information about the recipient (name, phone, address...).
	 * @returns {Promise<CheckoutSessionDTO>} - The newly created checkout session DTO.
	 */
	async createCheckoutSession(products, couponCode, userId, customerDetails) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Processes an incoming webhook event from the payment provider.
	 * Verified the signature and updates the order status in the database.
	 * @param {Buffer} payload - Raw request body from the provider.
	 * @param {object} headers - Request headers for signature verification.
	 * @returns {Promise<void>}
	 */
	async processWebhook(payload, headers) {
		throw new Error("Method not implemented.");
	}
}