import Stripe from "stripe";

import {IPaymentProvider} from "../../interfaces/providers/payment/IPaymentProvider.js";
import {CheckoutSessionDTO, PaymentEventDataDTO, WebhookPaymentEventDTO} from "../../domain/index.js";

import {SystemError} from "../../errors/index.js";

import {Currency} from "../../utils/currency.js";
import {CheckoutSessionModes, Currencies, PaymentEventTypes, PaymentMethodTypes} from "../../constants/payment.js";
import {IdempotencyPrefixes, StripeCouponDurations, StripeEvents, StripeHeaders} from "../../constants/stripe.js";

import {config} from "../../config.js";

export const stripe = new Stripe(config.providers.payment.stripe.secretKey);

/**
 * @augments IPaymentProvider
 * @description Handles all low-level communication and data translation for the Stripe API.
 */
export class StripeProvider extends IPaymentProvider {
	/**
	 * Converts a list of order items into Stripe-specific line items.
	 * @param {OrderProductItem[]} orderItems - Array of domain product items.
	 * @returns {Object[]}
	 */
	#processProducts(orderItems) {
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

	/**
	 * Creates a new Stripe coupon for a discount percentage.
	 * @param {number} discountPercentage - The percentage off (e.g., 10 for 10%).
	 * @returns {Promise<string>} The Stripe Coupon ID.
	 */
	async #createCoupon(discountPercentage) {
		const coupon = await stripe.coupons.create({
			percent_off: discountPercentage,
			duration: StripeCouponDurations.ONCE
		});

		return coupon.id;
	}

	#mapEventType(stripeType) {
		const types = {
			[StripeEvents.CHECKOUT_SESSION_COMPLETED]: PaymentEventTypes.SUCCESS
		}

		return types[stripeType] || PaymentEventTypes.UNKNOWN;
	}

	async createSession(orderItems, metadata, appliedCoupon) {
		const lineItems = this.#processProducts(orderItems);

		const discounts = [];
		if (appliedCoupon?.discountPercentage) {
			const stripeCouponId = await this.#createCoupon(appliedCoupon.discountPercentage);
			discounts.push({ coupon: stripeCouponId });
		}

		const { orderId } = metadata;
		const { clientUrl } = config.app;
		const { successUrl, cancelUrl } = config.providers.payment.stripe;

		const formURL = (input, base) => new URL(input, base).toString();

		try {
			const session = await stripe.checkout.sessions.create(
				{
					payment_method_types: [PaymentMethodTypes.CARD],
					line_items: lineItems,
					mode: CheckoutSessionModes.PAYMENT,
					success_url: formURL(successUrl, clientUrl),
					cancel_url: formURL(cancelUrl, clientUrl),
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

			return new CheckoutSessionDTO(session.id, Currency.fromCents(session.amount_total));
		}
		catch (error) {
			throw new SystemError(`[Stripe] Session error: ${error.message}`);
		}
	}

	constructEvent(payload, headers) {
		const signature = headers[StripeHeaders.SIGNATURE];
		const webhookSecret = config.providers.payment.stripe.webhookSecret;

		try {
			const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
			const type = this.#mapEventType(event.type);
			const session = event.data.object;

			const { orderId, userId, couponCode } = session.metadata;
			const totalAmountInCents = session.amount_total;

			const data = new PaymentEventDataDTO({
				orderId, userId, couponCode, totalAmountInCents
			});

			return new WebhookPaymentEventDTO(type, data);
		}
		catch (error) {
			throw new SystemError(`[Stripe] Webhook construct event Error: ${error.message}`);
		}
	}
}