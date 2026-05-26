import {ICheckoutService} from "../../interfaces/order/ICheckoutService.js";
import {IPaymentProvider} from "../../infrastructure/providers/payment/IPaymentProvider.ts";
import {ProductService} from "../product/ProductService.ts";
import {IOrderService} from "../../interfaces/order/IOrderService.js";
import {ICartService} from "../../interfaces/cart/ICartService.js";
import {ICouponService} from "../../interfaces/coupon/ICouponService.js";

import {
	CreateOrderDTO,
	CustomerDetails,
	OrderProductItem,
	PaymentMetadataDTO
} from "../../domain/index.js";
import {ShortProductDTO} from "../types/product.ts";

import {EntityNotFoundError} from "../../errors/index.js";

import {OrderStatus} from "../../constants/domain.js";
import {PaymentEventTypes} from "../../enums/payment.js";
import {Currency} from "../../utils/currency.js";

/**
 * @augments ICheckoutService
 */
export class CheckoutService extends ICheckoutService {
	/** @type {IPaymentProvider} */ #paymentProvider;
	/** @type {ProductService} */ #productService;
	/** @type {IOrderService} */ #orderService;
	/** @type {ICartService} */ #cartService;
	/** @type {ICouponService} */ #couponService;
	/** @type {number} */ #minAmountForGrant;

	/**
	 * @param {IPaymentProvider} paymentProvider
	 * @param {ProductService} productService
	 * @param {IOrderService} orderService
	 * @param {ICartService} cartService
	 * @param {ICouponService} couponService
	 * @param {number} minAmountForGrant
	 */
	constructor(
		paymentProvider,
		productService,
		orderService,
		cartService,
		couponService,
		minAmountForGrant
	)
	{
		super();
		this.#paymentProvider = paymentProvider;
		this.#productService = productService;
		this.#orderService = orderService;
		this.#cartService = cartService;
		this.#couponService = couponService;
		this.#minAmountForGrant = minAmountForGrant;
	}

	/**
	 * @param {OrderProductItem[]} products
	 * @param {number} totalAmountInCents
	 * @param {CustomerDetails} customerDetails
	 * @return {CreateOrderDTO}
	 */
	#formCreateOrderDTO (products, totalAmountInCents, customerDetails) {
		return new CreateOrderDTO({
			products,
			totalAmount: Currency.fromCents(totalAmountInCents),
			customerDetails: customerDetails,
			status: OrderStatus.AWAITING_PAYMENT
		});
	}

	/**
	 * @param {ClientProductDTO[]} clientProducts
	 * @param {ShortProductDTO[]} shortProductDTOs
	 * @return {OrderProductItem[]}
	 */
	#formOrderItems (clientProducts, shortProductDTOs) {
		return shortProductDTOs.map(p => {
			const clientProduct = clientProducts.find(cp => cp.id === p.id);
			const { id, name, price, image } = p;
			const { quantity } = clientProduct;

			return new OrderProductItem({
				id, quantity, name, price, image
			});
		});
	}

	/**
	 * @param {OrderProductItem[]} items
	 * @return {number}
	 */
	#calculateTotalInCents (items) {
		const initialValue = 0;
		return items.reduce(
			(total, item) => total + Currency.toCents(item.price),
			initialValue
		);
	}

	/**
	 * Calculates the final amount after applying a coupon, fetching the coupon details if available.
	 * @param {number} initialTotalAmountInCents - Total cost before discount (in cents).
	 * @param {string | undefined} couponCode
	 * @param {string} userId
	 * @returns {Promise<{ totalAmountInCents: number, appliedCoupon: CouponDTO | null }>}
	 */
	async #applyDiscount(initialTotalAmountInCents, couponCode, userId) {
		const defaultValue = { totalAmountInCents: initialTotalAmountInCents, appliedCoupon: null };

		if (!couponCode) return defaultValue;

		const coupon = await this.#couponService.getActiveByCodeAndUserId(couponCode, userId);
		if (!coupon) return defaultValue;

		const discount = Currency.calculatePercentage(initialTotalAmountInCents, coupon.discountPercentage);
		return { totalAmountInCents: initialTotalAmountInCents - discount, appliedCoupon: coupon };
	}

	/**
	 * Fire-and-forget logic to grant a new coupon if the initial purchase was large enough.
	 * @param {string} userId
	 * @param {number} amountPaidInCents
	 * @returns {Promise<void>}
	 */
	async #grantNewCouponIfEligible(userId, amountPaidInCents) {
		// Check if the purchase meets the minimum threshold
		if (amountPaidInCents < this.#minAmountForGrant) return;

		try {
			await this.#couponService.create(userId);
		} catch (error) {
			console.error(`Failed to grant coupon to user ${userId}:`, error.message);
		}
	}

	/**
	 * Finalizing coupon logic during checkout workflow
	 * @param {string} userId
	 * @param {string} couponCode
	 * @param {number} amountPaid
	 * @returns {Promise<void>}
	 */
	async #finalizeCouponUsage(userId, couponCode, amountPaid) {
		const tasks = [];

		if (couponCode) tasks.push(this.#couponService.deactivate(couponCode, userId));
		tasks.push(this.#grantNewCouponIfEligible(userId, amountPaid));

		await Promise.all(tasks);
	}

	/**
	 * @param {PaymentEventDataDTO} data
	 * @returns {Promise<void>}
	 */
	async #handleWebhookSuccess(data) {
		const { orderId, userId, couponCode, totalAmountInCents } = data;

		const order = await this.#orderService.getById(orderId);
		if (!order || order.status !== OrderStatus.AWAITING_PAYMENT) return;

		await this.#orderService.updateStatus(orderId, OrderStatus.PENDING);

		await Promise.all([
			this.#cartService.clear(userId),
			this.#finalizeCouponUsage(userId, couponCode, totalAmountInCents)
		]);
	}

	async checkout(userId, customerDetails, clientProducts, couponCode) {
		const productIds = clientProducts.map(p => p.id)
		const shortProductDTOs = await this.#productService.getShortDTOsByIds(productIds);

		if (shortProductDTOs.length !== productIds.length) {
			const foundIds = shortProductDTOs.map(p => p.id);
			throw new EntityNotFoundError("Product", { receivedIds: productIds, foundIds });
		}

		const orderItems = this.#formOrderItems(clientProducts, shortProductDTOs);

		const initialTotalAmountInCents = this.#calculateTotalInCents(orderItems);

		const { totalAmountInCents, appliedCoupon } = await this.#applyDiscount(
			initialTotalAmountInCents, couponCode, userId
		);

		const createOrderDTO = this.#formCreateOrderDTO(
			orderItems, totalAmountInCents, customerDetails
		);
		const orderDTO = await this.#orderService.create(userId, createOrderDTO);

		const sessionCheckoutDTO = await this.#paymentProvider.createSession(
			orderDTO.products,
			new PaymentMetadataDTO(orderDTO.id, orderDTO?.user.id),
			appliedCoupon
		);

		await this.#orderService.updatePaymentSessionId(orderDTO.id, sessionCheckoutDTO.id);

		return sessionCheckoutDTO;
	}

	async webhook(payload, headers) {
		const webhookPaymentEventDTO = this.#paymentProvider.constructEvent(payload, headers);

		switch (webhookPaymentEventDTO.type) {
			case PaymentEventTypes.SUCCESS:
				await this.#handleWebhookSuccess(webhookPaymentEventDTO.data);
				break;
			case PaymentEventTypes.UNKNOWN:
			default:
		}
	}
}