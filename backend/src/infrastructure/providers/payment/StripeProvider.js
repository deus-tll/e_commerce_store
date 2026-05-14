import {IPaymentProvider} from "./IPaymentProvider.js";
import {CheckoutSessionDTO, PaymentEventDataDTO, WebhookPaymentEventDTO} from "../../../domain/index.js";

import {SystemError} from "../../../errors/index.ts";

import {Currency} from "../../../utils/currency.js";
import {CheckoutSessionModes, Currencies, PaymentEventTypes, PaymentMethodTypes} from "../../../constants/payment.js";
import {IdempotencyPrefixes, StripeCouponDurations, StripeEvents, StripeHeaders} from "../../../constants/stripe.js";

/**
 * @augments IPaymentProvider
 * @description Handles all low-level communication and data translation for the Stripe API.
 */
export class StripeProvider extends IPaymentProvider {
	/** @type {import("stripe").Stripe} */ #stripe;
	/** @type {string} */ #webhookSecret;
	/** @type {string} */ #successUrl;
	/** @type {string} */ #cancelUrl;

	/**
	 * @param {import("stripe").Stripe} stripe
	 * @param {string} webhookSecret
	 * @param {string} successUrl
	 * @param {string} cancelUrl
	 */
	constructor(stripe, webhookSecret, successUrl, cancelUrl) {
		super();
		this.#stripe = stripe;
		this.#webhookSecret = webhookSecret;
		this.#successUrl = successUrl;
		this.#cancelUrl = cancelUrl;
	}

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
		const coupon = await this.#stripe.coupons.create({
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

		try {
			const session = await this.#stripe.checkout.sessions.create(
				{
					payment_method_types: [PaymentMethodTypes.CARD],
					line_items: lineItems,
					mode: CheckoutSessionModes.PAYMENT,
					success_url: this.#successUrl,
					cancel_url: this.#cancelUrl,
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

		try {
			const event = this.#stripe.webhooks.constructEvent(payload, signature, this.#webhookSecret);
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