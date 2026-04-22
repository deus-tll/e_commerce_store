import Stripe from "stripe";

import {IStripeProvider} from "../../interfaces/payment/IStripeProvider.js";

import {SystemError} from "../../errors/index.js";

import {Currency} from "../../utils/currency.js";
import {CheckoutSessionModes, Currencies, PaymentMethodTypes} from "../../constants/payment.js";
import {IdempotencyPrefixes, StripeCouponDurations, StripeHeaders} from "../../constants/stripe.js";

import {config} from "../../config.js";

export const stripe = new Stripe(config.providers.payment.stripe.secretKey);

/**
 * @augments IStripeProvider
 * @description Handles all low-level communication and data translation for the Stripe API.
 */
export class StripeProvider extends IStripeProvider {
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

	async prepareDiscountsForProvider(appliedCoupon) {
		if (!appliedCoupon) {
			return [];
		}

		const stripeCouponId = await this.#createCoupon(appliedCoupon.discountPercentage);

		return [
			{ coupon: stripeCouponId }
		];
	}

	processProductsForStripe(products) {
		let initialTotalAmount = 0;

		const lineItems = products.map(product => {
			const unitAmount = Currency.toCents(product.price);
			initialTotalAmount += unitAmount * (product.quantity || 1);

			return {
				price_data: {
					currency: Currencies.USD,
					product_data: {
						name: product.name,
						images: product.image ? [product.image] : []
					},
					unit_amount: unitAmount
				},
				quantity: product.quantity || 1
			};
		});

		return { lineItems, initialTotalAmount };
	}

	async createCheckoutSession(lineItems, stripeDiscounts, userId, couponCode, orderId) {
		const { successUrl, cancelUrl } = config.providers.payment.stripe;

		try {
			return await stripe.checkout.sessions.create(
				{
					payment_method_types: [PaymentMethodTypes.CARD],
					line_items: lineItems,
					mode: CheckoutSessionModes.PAYMENT,
					success_url: new URL(successUrl, config.app.clientUrl).toString(),
					cancel_url: new URL(cancelUrl, config.app.clientUrl).toString(),
					discounts: stripeDiscounts,
					metadata: {
						userId,
						orderId,
						couponCode: couponCode || ""
					}
				},
				{
					idempotencyKey: `${IdempotencyPrefixes.CHECKOUT_SESSION}-${orderId}`
				}
			);
		}
		catch (error) {
			throw new SystemError(`Stripe session creation failed: ${error.message}`);
		}
	}

	constructEvent(payload, headers) {
		const signature = headers[StripeHeaders.SIGNATURE];
		const webhookSecret = config.providers.payment.stripe.webhookSecret;

		try {
			return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
		}
		catch (error) {
			throw new SystemError(`Stripe Webhook Error: ${error.message}`);
		}
	}
}