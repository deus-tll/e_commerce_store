/**
 * Class representing a product data that is being sent by user during checkout
 */
export class ClientProductDTO {
	/** @type {string} @readonly */ id;
	/** @type {number} @readonly */ quantity;

	/**
	 * @param {string} id
	 * @param {number} quantity
	 */
	constructor(id, quantity) {
		this.id = id;
		this.quantity = quantity;

		Object.freeze(this);
	}
}

/**
 * The data to pass into payment session
 */
export class PaymentMetadataDTO {
	/** @type {string} @readonly */ orderId;
	/** @type {string} @readonly */ userId;

	/**
	 * @param {string} orderId
	 * @param {string} userId
	 */
	constructor(orderId, userId) {
		this.orderId = orderId;
		this.userId = userId;

		Object.freeze(this);
	}
}

/**
 * Agnostic class representing the result of a Payment Provider's checkout session creation.
 */
export class CheckoutSessionDTO {
	/** @type {string} @readonly */ id;
	/** @type {number} @readonly */ totalAmount;

	/**
	 * @param {string} id - The ID of the created checkout session.
	 * @param {number} totalAmount - The total amount for the session (in major currency units).
	 */
	constructor(id, totalAmount) {
		this.id = id;
		this.totalAmount = totalAmount;

		Object.freeze(this);
	}
}

/**
 * Class representing the data of an event from payment webhook completion.
 */
export class PaymentEventDataDTO {
	/** @type {string} @readonly */ orderId;
	/** @type {string} @readonly */ userId;
	/** @type {string} @readonly */ couponCode;
	/** @type {number} @readonly */ totalAmountInCents;

	/**
	 * @param {object} data
	 * @param {string} data.orderId
	 * @param {string} data.userId
	 * @param {string} data.couponCode
	 * @param {number} data.totalAmountInCents
	 */
	constructor(data) {
		this.orderId = data.orderId;
		this.userId = data.userId;
		this.couponCode = data.couponCode;
		this.totalAmountInCents = data.totalAmountInCents;

		Object.freeze(this);
	}
}

/**
 * Successfully processed webhook's payment event object
 */
export class WebhookPaymentEventDTO {
	/** @type {string} @readonly */ type;
	/** @type {PaymentEventDataDTO} @readonly */ data;

	/**
	 * @param {string} type
	 * @param {PaymentEventDataDTO} data
	 */
	constructor(type, data) {
		this.type = type;
		this.data = data;

		Object.freeze(this);
	}
}