import {IPaymentService} from "../../interfaces/payment/IPaymentService.js";
import {IStripeService} from "../../interfaces/payment/IStripeService.js";
import {IProductService} from "../../interfaces/product/IProductService.js";
import {ICheckoutOrderHandler} from "../../interfaces/order/ICheckoutOrderHandler.js";
import {ICouponHandler} from "../../interfaces/coupon/ICouponHandler.js";
import {CheckoutSessionDTO, OrderProductItem} from "../../domain/index.js";

import {EntityNotFoundError} from "../../errors/index.js";

import {Currency} from "../../utils/currency.js";

export class StripePaymentService extends IPaymentService {
	/** @type {IStripeService} */ #stripeService;
	/** @type {IProductService} */ #productService;
	/** @type {ICheckoutOrderHandler} */ #orderHandler;
	/** @type {ICouponHandler} */ #couponHandler;

	/**
	 * @param {IStripeService} stripeService
	 * @param {IProductService} productService
	 * @param {ICheckoutOrderHandler} orderHandler
	 * @param {ICouponHandler} couponHandler
	 */
	constructor(stripeService, productService, orderHandler, couponHandler) {
		super();
		this.#stripeService = stripeService;
		this.#productService = productService;
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
		const productIds = products.map(p => p.id);
		const shortProductDTOs = await this.#productService.getShortDTOsByIds(productIds);

		if (shortProductDTOs.length !== productIds.length) {
			const foundIds = shortProductDTOs.map(p => p.id);
			const missingId = productIds.find(id => !foundIds.includes(id));
			throw new EntityNotFoundError("Product", { id: missingId });
		}

		const orderItems = shortProductDTOs.map((p) => {
			const clientProduct = products.find((cp) => cp.id === p.id);
			return new OrderProductItem({
				id: p.id,
				quantity: clientProduct.quantity,
				price: p.price,
				name: p.name,
				image: p.image
			});
		});

		// 1. Prepare line items
		const { lineItems, initialTotalAmount } = this.#stripeService.processProductsForStripe(orderItems);

		// 2. Apply coupon discount
		const { totalAmount, appliedCoupon } = await this.#couponHandler.applyDiscount(
			initialTotalAmount,
			couponCode,
			userId
		);

		// 4. Prepare Stripe discounts (if coupon applied)
		const stripeDiscounts = await this.#stripeService.prepareDiscountsForProvider(appliedCoupon);

		const productsSnapshot = this.#getProductsMetadataSnapshot(orderItems);

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
		if (existingOrder) return existingOrder;

		const sessionData = await this.#stripeService.retrievePaidSessionData(sessionId);

		return await this.#orderHandler.handleOrderCreation(
			sessionData.metadata,
			sessionId,
			sessionData.amountTotal
		);
	}
}