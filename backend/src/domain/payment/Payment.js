/**
 * Agnostic class representing the result of a Stripe (or other) checkout session creation.
 * Used by the Service layer to return structured and vendor-agnostic payment data.
 */
export class CheckoutSessionDTO {
	/** @type {string} @readonly */ id;
	/** @type {number} @readonly */ totalAmount;

	/**
	 * @param {object} data
	 * @param {string} data.id - The ID of the created checkout session.
	 * @param {number} data.totalAmount - The total amount for the session (in major currency units).
	 */
	constructor(data) {
		this.id = data.id;
		this.totalAmount = data.totalAmount;

		Object.freeze(this);
	}
}

/**
 * Agnostic class representing the result of a successful checkout process.
 * Returned after successful payment confirmation and order creation.
 */
export class CheckoutSuccessDTO {
	/** @type {boolean} @readonly */ success;
	/** @type {string} @readonly */ message;
	/** @type {string} @readonly */ orderId;
	/** @type {string} @readonly */ orderNumber;

	/**
	 * @param {object} data
	 * @param {boolean} data.success - Indicates if the payment process was successful.
	 * @param {string} data.message - Human-readable message describing the result.
	 * @param {string} data.orderId - The ID of the associated order.
	 * @param {string} data.orderNumber - The number of the order.
	 */
	constructor(data) {
		this.success = data.success;
		this.message = data.message;
		this.orderId = data.orderId;
		this.orderNumber = data.orderNumber;

		Object.freeze(this);
	}
}