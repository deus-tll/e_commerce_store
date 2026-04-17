import {ICheckoutOrderHandler} from "../../interfaces/order/ICheckoutOrderHandler.js";
import {IOrderService} from "../../interfaces/order/IOrderService.js";
import {ICouponService} from "../../interfaces/coupon/ICouponService.js";
import {ICartService} from "../../interfaces/cart/ICartService.js";
import {
	CreateOrderDTO,
	CustomerDetails
} from "../../domain/index.js";

import {OrderStatus} from "../../constants/domain.js";

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

	async createInitialOrder(userId, orderItems, totalAmount, customerDetails) {
		const orderData = new CreateOrderDTO({
			products: orderItems,
			totalAmount,
			customerDetails: new CustomerDetails(customerDetails),
			status: OrderStatus.AWAITING_PAYMENT
		});

		return await this.#orderService.create(userId, orderData);
	}

	async handlePaymentSuccess(orderId, userId, couponCode, totalAmountCents) {
		const order = await this.#orderService.getById(orderId);

		if (!order || order.status !== OrderStatus.AWAITING_PAYMENT) {
			return order;
		}

		const updatedOrder = await this.#orderService.updateStatus(orderId, OrderStatus.PENDING);

		const sideEffects = [];
		sideEffects.push(this.#cartService.clear(userId));
		sideEffects.push(this.#couponHandler.grantNewCouponIfEligible(userId, totalAmountCents));

		if (couponCode) {
			sideEffects.push(this.#couponService.deactivate(couponCode, userId));
		}

		await Promise.all(sideEffects);
		return updatedOrder;
	}

	async updatePaymentSessionId(orderId, paymentSessionId){
		await this.#orderService.updatePaymentSessionId(orderId, paymentSessionId);
	}
}