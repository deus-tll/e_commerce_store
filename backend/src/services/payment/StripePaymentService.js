import {IPaymentService} from "../../interfaces/payment/IPaymentService.js";
import {IStripeService} from "../../interfaces/payment/IStripeService.js";
import {IProductService} from "../../interfaces/product/IProductService.js";
import {ICheckoutOrderHandler} from "../../interfaces/order/ICheckoutOrderHandler.js";
import {ICouponHandler} from "../../interfaces/coupon/ICouponHandler.js";
import {CheckoutSessionDTO, OrderProductItem} from "../../domain/index.js";

import {EntityNotFoundError} from "../../errors/index.js";

import {Currency} from "../../utils/currency.js";
import {StripeEvents} from "../../constants/stripe.js";

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

	async createCheckoutSession(products, couponCode, userId, customerDetails) {
		// 1. Validate and fetch products
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

		// 2. Calculate totals and discounts
		const { lineItems, initialTotalAmount } = this.#stripeService.processProductsForStripe(orderItems);
		const { totalAmount, appliedCoupon } = await this.#couponHandler.applyDiscount(
			initialTotalAmount,
			couponCode,
			userId
		);

		// 3. Create order in DB
		const order = await this.#orderHandler.createInitialOrder(
			userId,
			orderItems,
			Currency.fromCents(totalAmount),
			customerDetails
		);

		// 4. Create Provider Session
		const stripeDiscounts = await this.#stripeService.prepareDiscountsForProvider(appliedCoupon);
		const session = await this.#stripeService.createCheckoutSession(
			lineItems,
			stripeDiscounts,
			userId,
			couponCode,
			order.id
		);

		// 5. Link Session ID to our Order for future polling
		await this.#orderHandler.updatePaymentSessionId(order.id, session.id);

		return new CheckoutSessionDTO({
			id: session.id,
			totalAmount: Currency.fromCents(totalAmount)
		});
	}

	async processWebhook(payload, headers) {
		const event = this.#stripeService.constructEvent(payload, headers);

		if (event.type === StripeEvents.CHECKOUT_SESSION_COMPLETED) {
			const session = event.data.object;

			const { orderId, userId, couponCode } = session.metadata;
			const totalAmountCents = session.amount_total;

			await this.#orderHandler.handlePaymentSuccess(
				orderId,
				userId,
				couponCode,
				totalAmountCents
			);
		}
	}
}