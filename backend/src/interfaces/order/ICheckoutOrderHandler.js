/**
 * @interface
 * @description Defines the contract for handling the final steps of a successful checkout,
 * including idempotency checks and order finalization.
 */
export class ICheckoutOrderHandler {
	/**
	 * Handles the order creation before payment.
	 * @param {string} userId
	 * @param {OrderProductItem[]} orderItems
	 * @param {number} totalAmount - The final amount to pay (in cents).
	 * @param {object} customerDetails
	 * @returns {Promise<OrderDTO>}
	 */
	async createInitialOrder(userId, orderItems, totalAmount, customerDetails) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Handles actions after successful payment.
	 * @param {string} orderId
	 * @param {string} userId
	 * @param {string} couponCode
	 * @param {number} totalAmountCents
	 * @returns {Promise<OrderDTO>}
	 */
	async handlePaymentSuccess(orderId, userId, couponCode, totalAmountCents) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Handles actions after successful payment.
	 * @param {string} orderId
	 * @param {string} paymentSessionId
	 * @returns {Promise<void>}
	 */
	async updatePaymentSessionId(orderId, paymentSessionId) {
		throw new Error("Method not implemented.");
	}
}