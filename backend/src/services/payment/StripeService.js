import {stripe} from "../../infrastructure/stripe.js";
import {IStripeService} from "../../interfaces/payment/IStripeService.js";

import {BadRequestError} from "../../errors/apiErrors.js";

import {Currency} from "../../utils/currency.js";
import {EnvModes} from "../../constants/app.js";
import {CheckoutSessionModes, Currencies, PaymentMethodTypes, PaymentStatus} from "../../constants/payment.js";
import {StripeCouponDurations} from "../../constants/stripe.js";
import {config} from "../../config.js";

const APP_URL =
	config.nodeEnv !== EnvModes.PROD
		? config.developmentClientUrl
		: config.appUrl;

/**
 * @augments IStripeService
 * @description Handles all low-level communication and data translation for the Stripe API.
 */
export class StripeService extends IStripeService {
	/**
	 * Retrieves a Stripe Checkout Session.
	 * @param {string} sessionId
	 * @returns {Promise<object>} - The raw Stripe Session object.
	 */
	async #retrieveCheckoutSession(sessionId) {
		return stripe.checkout.sessions.retrieve(sessionId);
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

	async createCheckoutSession(lineItems, stripeDiscounts, userId, couponCode, productsSnapshot) {
		const successUrl = new URL(config.paymentProvider.successUrl, APP_URL).toString();
		const cancelUrl = new URL(config.paymentProvider.cancelUrl, APP_URL).toString();

		const session = await stripe.checkout.sessions.create(
			{
				payment_method_types: [PaymentMethodTypes.CARD],
				line_items: lineItems,
				mode: CheckoutSessionModes.PAYMENT,
				success_url: successUrl,
				cancel_url: cancelUrl,
				discounts: stripeDiscounts,
				metadata: {
					userId,
					couponCode: couponCode || "",
					products: productsSnapshot
				}
			},
			{
				idempotencyKey: `${userId}-${Date.now()}`
			}
		);

		console.info(
			`[StripeService] Created session ${session.id} for user ${userId}`
		);

		return session;
	}

	async retrievePaidSessionData(sessionId) {
		const session = await this.#retrieveCheckoutSession(sessionId);

		if (session.payment_status !== PaymentStatus.PAID) {
			throw new BadRequestError("Payment confirmation failed");
		}

		return {
			metadata: session.metadata,
			amountTotal: session.amount_total,
		};
	}
}