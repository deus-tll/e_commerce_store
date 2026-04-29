import {ClientProductDTO, CustomerDetails, CheckoutSessionDTO} from "../../domain/index.js";

/**
 * @interface
 * @description Defines the contract for handling the checkout workflow.
 */
export class ICheckoutService {
	/**
	 * @param {string} userId - ID of the user creating the session.
	 * @param {CustomerDetails} customerDetails - Information about the recipient (name, phone, address...).
	 * @param {ClientProductDTO[]} products - Array of products to purchase.
	 * @param {string} [couponCode] - Optional coupon code to apply.
	 * @returns {Promise<CheckoutSessionDTO>} - The newly created checkout session DTO.
	 */
	async checkout(userId, customerDetails, products, couponCode) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Processes an incoming webhook event from the payment provider.
	 * Verifies the signature and updates the order status in the database.
	 * @param {Buffer} payload - Raw request body from the provider.
	 * @param {object} headers - Request headers for signature verification.
	 * @returns {Promise<void>}
	 */
	async webhook(payload, headers) {
		throw new Error("Method not implemented.");
	}
}