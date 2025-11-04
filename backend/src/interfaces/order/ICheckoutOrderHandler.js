import { CheckoutSuccessDTO } from "../../domain/index.js";

/**
 * @interface
 * @description Defines the contract for handling the final steps of a successful checkout,
 * including idempotency checks and order finalization.
 */
export class ICheckoutOrderHandler {
	/**
	 * Handles the successful completion of a payment, including order creation and coupon cleanup.
	 * @param {object} sessionMetadata - Metadata containing userId, couponCode, products.
	 * @param {string} sessionId - The payment session ID (for idempotency).
	 * @param {number} totalAmountCents - The final amount paid (in cents).
	 * @returns {Promise<CheckoutSuccessDTO>}
	 */
	async handleOrderCreation(sessionMetadata, sessionId, totalAmountCents) { throw new Error("Method not implemented."); }

	/**
	 * Checks if an order for a given payment session already exists (idempotency check).
	 * @param {string} sessionId
	 * @returns {Promise<CheckoutSuccessDTO | null>} Returns DTO if order exists, null otherwise.
	 */
	async checkExistingOrder(sessionId) { throw new Error("Method not implemented."); }
}