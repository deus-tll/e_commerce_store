/**
 * Agnostic class representing the result of a Stripe (or other) checkout session creation.
 * Used by the Service layer to return structured and vendor-agnostic payment data.
 */
export class CheckoutSessionDTO {
	/** @type {string} */ id;
	/** @type {number} */ totalAmount;

	/**
	 * @param {object} data
	 * @param {string} data.id - The ID of the created checkout session.
	 * @param {number} data.totalAmount - The total amount for the session (in major currency units).
	 */
	constructor({ id, totalAmount }) {
		this.id = id;
		this.totalAmount = totalAmount;
	}
}

/**
 * Agnostic class representing the result of a successful checkout process.
 * Returned after successful payment confirmation and order creation.
 */
export class CheckoutSuccessDTO {
	/** @type {boolean} */ success;
	/** @type {string} */ message;
	/** @type {string} */ orderId;

	/**
	 * @param {object} data
	 * @param {boolean} data.success - Indicates if the payment process was successful.
	 * @param {string} data.message - Human-readable message describing the result.
	 * @param {string} data.orderId - The ID of the associated order.
	 */
	constructor({ success, message, orderId }) {
		this.success = success;
		this.message = message;
		this.orderId = orderId;
	}
}