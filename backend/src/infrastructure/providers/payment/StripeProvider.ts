import Stripe from "stripe";

import {IPaymentProvider} from "./IPaymentProvider.js";

import {OrderProductItem} from "../../../entities/order/types/OrderProductItem.js";
import {PaymentMetadataDTO, CheckoutSessionDTO, PaymentEventDataDTO, WebhookPaymentEventDTO} from "../../../application/types/payment.js";
import {
	CouponDTO
} from "../../../domain/index.js";

import {SystemError} from "../../../errors/index.js";

import {Currency} from "../../../utils/currency.js";
import {CheckoutSessionModes, Currencies, PaymentEventTypes, PaymentMethodTypes} from "../../../enums/payment.js";
import {IdempotencyPrefixes, StripeCouponDurations, StripeEvents, StripeHeaders} from "../../../enums/stripe.js";

export class StripeProvider extends IPaymentProvider {
	private readonly stripe: Stripe;
	private readonly webhookSecret: string;
	private readonly successUrl: string;
	private readonly cancelUrl: string;

	constructor(stripe: Stripe, webhookSecret: string, successUrl: string, cancelUrl: string) {
		super();
		this.stripe = stripe;
		this.webhookSecret = webhookSecret;
		this.successUrl = successUrl;
		this.cancelUrl = cancelUrl;
	}

	private processProducts(orderItems: OrderProductItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] {
		return orderItems.map(item => {
			const unitAmount = Currency.toCents(item.price);

			return {
				price_data: {
					currency: Currencies.USD,
					product_data: {
						name: item.name,
						images: item.image ? [item.image] : []
					},
					unit_amount: unitAmount
				},
				quantity: item.quantity || 1
			};
		});
	}

	private async createCoupon(discountPercentage: number): Promise<string> {
		const coupon = await this.stripe.coupons.create({
			percent_off: discountPercentage,
			duration: StripeCouponDurations.ONCE
		});

		return coupon.id;
	}

	private mapEventType(stripeType: string): string {
		const types: Record<string, string> = {
			[StripeEvents.CHECKOUT_SESSION_COMPLETED]: PaymentEventTypes.SUCCESS
		}

		return types[stripeType] || PaymentEventTypes.UNKNOWN;
	}

	async createSession(
		orderItems: OrderProductItem[],
		metadata: PaymentMetadataDTO,
		appliedCoupon?: CouponDTO | null
	): Promise<CheckoutSessionDTO> {
		const lineItems = this.processProducts(orderItems);
		const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];

		if (appliedCoupon?.discountPercentage) {
			const stripeCouponId = await this.createCoupon(appliedCoupon.discountPercentage);
			discounts.push({ coupon: stripeCouponId });
		}

		const { orderId } = metadata;

		try {
			const session = await this.stripe.checkout.sessions.create(
				{
					payment_method_types: [PaymentMethodTypes.CARD],
					line_items: lineItems,
					mode: CheckoutSessionModes.PAYMENT as Stripe.Checkout.SessionCreateParams.Mode,
					success_url: this.successUrl,
					cancel_url: this.cancelUrl,
					discounts,
					metadata: {
						...metadata,
						couponCode: appliedCoupon?.code || ""
					}
				},
				{
					idempotencyKey: `${IdempotencyPrefixes.CHECKOUT_SESSION}-${orderId}`
				}
			);

			return new CheckoutSessionDTO(session.id, Currency.fromCents(session.amount_total ?? 0));
		}
		catch (error: any) {
			throw new SystemError(`[Stripe] Session error: ${error.message}`);
		}
	}

	constructEvent(payload: Buffer, headers: Record<string, any>) {
		const signature = headers[StripeHeaders.SIGNATURE];

		try {
			const event = this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
			const type = this.mapEventType(event.type);
			const session = event.data.object as Stripe.Checkout.Session;

			const { orderId, userId, couponCode } = session.metadata;
			const totalAmountInCents = session.amount_total ?? 0;

			const data = new PaymentEventDataDTO({
				orderId, userId, couponCode, totalAmountInCents
			});

			return new WebhookPaymentEventDTO(type, data);
		}
		catch (error: any) {
			throw new SystemError(`[Stripe] Webhook construct event Error: ${error.message}`);
		}
	}
}