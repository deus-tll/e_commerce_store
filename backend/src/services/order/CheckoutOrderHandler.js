import {ICheckoutOrderHandler} from "../../interfaces/order/ICheckoutOrderHandler.js";
import {IOrderService} from "../../interfaces/order/IOrderService.js";
import {ICouponService} from "../../interfaces/coupon/ICouponService.js";
import {ICartService} from "../../interfaces/cart/ICartService.js";
import {CheckoutSuccessDTO, CreateOrderDTO, OrderProductItem} from "../../domain/index.js";

import {EntityAlreadyExistsError, SystemError} from "../../errors/index.js";

import {Currency} from "../../utils/currency.js";

/**
 * @augments ICheckoutOrderHandler
 * @description Implements the final order processing steps after a payment is confirmed.
 * This includes checking for existing orders (idempotency), parsing session metadata,
 * deactivating used coupons, and creating the final order record.
 */
export class CheckoutOrderHandler extends ICheckoutOrderHandler {
	/** @type {IOrderService} */ #orderService;
	/** @type {ICouponService} */ #couponService;
	/** @type {ICartService} */ #cartService;
	/** @type {ICouponHandler} */ #couponHandler;

	/**
	 * @param {IOrderService} orderService
	 * @param {ICouponService} couponService
	 * @param {ICartService} cartService
	 * @param {ICouponHandler} couponHandler
	 */
	constructor(orderService, couponService, cartService, couponHandler) {
		super();
		this.#orderService = orderService;
		this.#couponService = couponService;
		this.#cartService = cartService;
		this.#couponHandler = couponHandler;
	}

	async checkExistingOrder(sessionId) {
		const existingOrder = await this.#orderService.getByPaymentSessionId(sessionId);

		if (existingOrder) {
			return new CheckoutSuccessDTO({
				success: true,
				message: "Payment already processed",
				orderId: existingOrder.id,
				orderNumber: existingOrder.orderNumber
			});
		}

		return null;
	}

	async handleOrderCreation(sessionMetadata, sessionId, totalAmountCents) {
		const { userId, couponCode, products } = sessionMetadata;
		let parsedProducts;

		try {
			parsedProducts = JSON.parse(products);
		} catch (e) {
			throw new SystemError("Corrupted product metadata in payment session.");
		}

		// Convert from cents (base unit) back to standard currency for the order record
		const totalAmount = Currency.fromCents(totalAmountCents);

		const orderData = new CreateOrderDTO({
			products: parsedProducts.map(item => new OrderProductItem(item)),
			totalAmount,
			paymentSessionId: sessionId
		});

		try {
			const newOrder = await this.#orderService.create(userId, orderData);

			const sideEffects = [];

			sideEffects.push(this.#cartService.clear(userId));

			if (couponCode) {
				sideEffects.push(this.#couponService.deactivate(couponCode, userId));
			}

			sideEffects.push(
				this.#couponHandler.grantNewCouponIfEligible(userId, totalAmountCents)
			);

			await Promise.all(sideEffects);

			return new CheckoutSuccessDTO({
				success: true,
				message: "Payment successful and order processed.",
				orderId: newOrder.id,
				orderNumber: newOrder.orderNumber
			});
		} catch (error) {
			// Handle database EntityAlreadyExistsError (race condition during order creation)
			if (error instanceof EntityAlreadyExistsError) {
				const existingOrderResult = await this.checkExistingOrder(sessionId);
				if (existingOrderResult) return existingOrderResult;
			}
			throw error;
		}
	}
}