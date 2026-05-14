import {OrderProductItem, CouponDTO, PaymentMetadataDTO, WebhookPaymentEventDTO} from "../../../domain/index.js";

/**
 * @interface IPaymentProvider
 * @description Contract for all direct interactions with the external Provider's API.
 */
export class IPaymentProvider {
	/**
	 * Creates a new Checkout Session.
	 * @param {OrderProductItem[]} orderItems
	 * @param {PaymentMetadataDTO} metadata
	 * @param {CouponDTO | null} [appliedCoupon]
	 * @returns {Promise<CheckoutSessionDTO>}
	 */
	async createSession(orderItems, metadata, appliedCoupon) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Verifies Provider's signature and constructs the event object.
	 * @param {Buffer} payload
	 * @param {object} headers
	 * @returns {WebhookPaymentEventDTO}
	 */
	constructEvent(payload, headers) {
		throw new Error("Method not implemented.");
	}
}