import {IPaymentService} from "../../interfaces/payment/IPaymentService.js";
import {IStripeService} from "../../interfaces/payment/IStripeService.js";
import {ICheckoutOrderHandler} from "../../interfaces/order/ICheckoutOrderHandler.js";
import {ICouponHandler} from "../../interfaces/coupon/ICouponHandler.js";
import {CheckoutSessionDTO, OrderProductItem} from "../../domain/index.js";

import {BadRequestError} from "../../errors/apiErrors.js";

import {Currency} from "../../utils/currency.js";

export class StripePaymentService extends IPaymentService {
	/** @type {IStripeService} */ #stripeService;
	/** @type {ICheckoutOrderHandler} */ #orderHandler;
	/** @type {ICouponHandler} */ #couponHandler;

	/**
	 * @param {IStripeService} stripeService
	 * @param {ICheckoutOrderHandler} orderHandler
	 * @param {ICouponHandler} couponHandler
	 */
	constructor(stripeService, orderHandler, couponHandler) {
		super();
		this.#stripeService = stripeService;
		this.#orderHandler = orderHandler;
		this.#couponHandler = couponHandler;
	}

	/**
	 * Builds simplified product data for Stripe metadata.
	 * @param {OrderProductItem[]} products
	 * @returns {string} JSON string of product snapshots.
	 */
	#getProductsMetadataSnapshot(products) {
		const snapshot = products.map((product) => {
			return {
				id: product.id,
				quantity: product.quantity,
				price: product.price,
				name: product.name,
				image: product.image
			};
		});

		return JSON.stringify(snapshot);
	}

	async createCheckoutSession(products, couponCode, userId) {
		if (!Array.isArray(products) || products.length === 0) {
			throw new BadRequestError("Invalid or empty products array");
		}

		// 1. Prepare line items
		const { lineItems, initialTotalAmount } = this.#stripeService.processProductsForStripe(products);

		// 2. Apply coupon discount
		const { totalAmount, appliedCoupon } = await this.#couponHandler.applyDiscount(
			initialTotalAmount,
			couponCode,
			userId
		);

		// 3. Optionally grant new coupon
		this.#couponHandler.grantNewCouponIfEligible(userId, initialTotalAmount);

		// 4. Prepare Stripe discounts (if coupon applied)
		const stripeDiscounts = await this.#stripeService.prepareDiscountsForProvider(appliedCoupon);

		const productsSnapshot = this.#getProductsMetadataSnapshot(products);

		// 5. Create Stripe session
		const session = await this.#stripeService.createCheckoutSession(
			lineItems,
			stripeDiscounts,
			userId,
			couponCode,
			productsSnapshot
		);

		return new CheckoutSessionDTO({
			id: session.id,
			totalAmount: Currency.fromCents(totalAmount)
		});
	}

	async checkoutSuccess(sessionId) {
		const existingOrder = await this.#orderHandler.checkExistingOrder(sessionId);
		if (existingOrder) {
			return existingOrder;
		}

		const sessionData = await this.#stripeService.retrievePaidSessionData(sessionId);

		return await this.#orderHandler.handleOrderCreation(
			sessionData.metadata,
			sessionId,
			sessionData.amountTotal
		);
	}
}