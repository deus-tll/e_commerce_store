import {ICheckoutOrderHandler} from "../../interfaces/order/ICheckoutOrderHandler.js";
import {IOrderService} from "../../interfaces/order/IOrderService.js";
import {ICouponService} from "../../interfaces/coupon/ICouponService.js";
import {CheckoutSuccessDTO, CreateOrderDTO} from "../../domain/index.js";

import {ConflictError, InternalServerError} from "../../errors/apiErrors.js";

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

	/**
	 * @param {IOrderService} orderService
	 * @param {ICouponService} couponService
	 */
	constructor(orderService, couponService) {
		super();
		this.#orderService = orderService;
		this.#couponService = couponService;
	}

	async checkExistingOrder(sessionId) {
		const existingOrder = await this.#orderService.getByPaymentSessionId(sessionId);

		if (existingOrder) {
			return new CheckoutSuccessDTO({
				success: true,
				message: "Payment already processed",
				orderId: existingOrder.id
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
			console.error("Failed to parse product metadata from payment session:", products, e);
			throw new InternalServerError("Internal error: Corrupted product metadata.");
		}

		// Convert from cents (base unit) back to standard currency for the order record
		const totalAmount = Currency.fromCents(totalAmountCents);

		// 1. Deactivate coupon if one was used
		if (couponCode) {
			await this.#couponService.deactivate(couponCode, userId);
		}

		// 2. Create order
		const orderData = new CreateOrderDTO({
			userId,
			products: parsedProducts,
			totalAmount,
			paymentSessionId: sessionId
		});

		try {
			const newOrder = await this.#orderService.create(orderData);

			return new CheckoutSuccessDTO({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used",
				orderId: newOrder.id
			});
		} catch (error) {
			// Handle database ConflictError (race condition during order creation)
			if (error instanceof ConflictError) {
				const existingOrder = await this.#orderService.getByPaymentSessionId(sessionId);

				if (existingOrder) {
					// Return success if the order already exists due to concurrency
					return new CheckoutSuccessDTO({
						success: true,
						message: "Order already processed concurrently",
						orderId: existingOrder.id
					});
				}
			}

			throw error;
		}
	}
}