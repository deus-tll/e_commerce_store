import {OrderProductItem} from "../../../entities/order/types/OrderProductItem.js";
import {PaymentMetadataDTO, CheckoutSessionDTO, WebhookPaymentEventDTO} from "../../../application/types/payment.js";
import {CouponDTO} from "../../../application/types/coupon.js";

export abstract class IPaymentProvider {
	/**
	 * Creates a new Checkout Session.
	 */
	abstract createSession(
		orderItems: readonly OrderProductItem[],
		metadata: PaymentMetadataDTO,
		appliedCoupon?: CouponDTO | null
	): Promise<CheckoutSessionDTO>;

	/**
	 * Verifies Provider's signature and constructs the event object.
	 */
	abstract constructEvent(
		payload: Buffer,
		headers: Record<string, any>
	): WebhookPaymentEventDTO;
}