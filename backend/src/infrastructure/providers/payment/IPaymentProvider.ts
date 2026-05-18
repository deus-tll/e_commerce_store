import {
	OrderProductItem,
	CouponDTO,
	PaymentMetadataDTO,
	WebhookPaymentEventDTO,
	CheckoutSessionDTO
} from "../../../domain/index.js";

export abstract class IPaymentProvider {
	/**
	 * Creates a new Checkout Session.
	 */
	abstract createSession(
		orderItems: OrderProductItem[],
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