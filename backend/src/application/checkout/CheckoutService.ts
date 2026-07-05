import {IPaymentProvider} from "../../infrastructure/providers/payment/IPaymentProvider.js";
import {ProductService} from "../product/ProductService.js";
import {OrderService} from "../order/OrderService.js";
import {CartService} from "../cart/CartService.js";
import {CouponService} from "../coupon/CouponService.js";

import {OrderProductItem} from "../../entities/order/types/OrderProductItem.js";
import {CustomerDetails} from "../../entities/order/types/CustomerDetails.js";
import {ShortProductDTO} from "../types/product.js";
import {OrderCreateInput} from "../types/order.js";
import {ClientItemInput, PaymentMetadataDTO, CheckoutSessionDTO, PaymentEventDataDTO} from "../types/payment.js";
import {CouponDTO} from "../types/coupon.js";

import {OrderStatus} from "../../enums/application.js";
import {PaymentEventTypes} from "../../enums/payment.js";

import {InsufficientStockError} from "../../errors/InsufficientStockError.js";
import {EntityNotFoundError} from "../../errors/index.js";

import {Currency} from "../../utils/currency.js";
import {getErrorMessage} from "../../utils/error.js";

interface ApplyDiscountResponse {
	totalAmountInCents: number,
	appliedCoupon: CouponDTO | null
}

export class CheckoutService {
	constructor(
		private readonly paymentProvider: IPaymentProvider,
		private readonly productService: ProductService,
		private readonly orderService: OrderService,
		private readonly cartService: CartService,
		private readonly couponService: CouponService,
		private readonly minAmountForGrant: number
	) {}

	private formOrderItems(
		clientItems: ClientItemInput[],
		shortProductDTOs: ShortProductDTO[]
	): OrderProductItem[] {
		return shortProductDTOs
			.map(product => {
				const clientProduct = clientItems.find(clientItem => clientItem.id === product.id);

				if (!clientProduct) return null;

				const { id, name, price, image } = product;
				const { quantity } = clientProduct;

				return new OrderProductItem({
					id, quantity, name, price, image
				});
			})
			.filter((x): x is OrderProductItem => x !== null);
	}

	private calculateTotalInCents(items: OrderProductItem[]): number {
		const initialValue = 0;
		return items.reduce(
			(total, item) => total + Currency.toCents(item.price),
			initialValue
		);
	}

	/**
	 * Calculates the final amount after applying a coupon, fetching the coupon details if available.
	 */
	private async applyDiscount(
		initialTotalAmountInCents: number,
		userId: string,
		couponCode?: string
	): Promise<ApplyDiscountResponse> {
		const defaultValue: ApplyDiscountResponse = { totalAmountInCents: initialTotalAmountInCents, appliedCoupon: null };

		if (!couponCode) return defaultValue;

		const coupon = await this.couponService.getActiveByCodeAndUserId(couponCode, userId);
		if (!coupon) return defaultValue;

		const discount = Currency.calculatePercentage(initialTotalAmountInCents, coupon.discountPercentage);
		return { totalAmountInCents: initialTotalAmountInCents - discount, appliedCoupon: coupon };
	}

	/**
	 * Fire-and-forget logic to grant a new coupon if the initial purchase was large enough.
	 */
	private async grantNewCouponIfEligible(userId: string, amountPaidInCents: number): Promise<void> {
		// Check if the purchase meets the minimum threshold
		if (amountPaidInCents < this.minAmountForGrant) return;

		try {
			await this.couponService.create(userId);
		} catch (error: unknown) {
			console.error(`Failed to grant coupon to user ${userId}:`, getErrorMessage(error));
		}
	}

	private async finalizeCouponUsage(userId: string, amountPaid: number, couponCode: string, providerCouponId: string): Promise<void> {
		const tasks: Promise<any>[] = [];

		if (couponCode) tasks.push(this.couponService.deactivate(couponCode, userId));
		if (providerCouponId) tasks.push(this.paymentProvider.deleteUsedCoupon(providerCouponId));
		tasks.push(this.grantNewCouponIfEligible(userId, amountPaid));

		await Promise.all(tasks);
	}

	private async handleWebhookSuccess(data: PaymentEventDataDTO): Promise<void> {
		const { orderId, userId, couponCode, totalAmountInCents, providerCouponId } = data;

		const order = await this.orderService.getById(orderId);
		if (!order || order.status !== OrderStatus.AWAITING_PAYMENT) return;

		try {
			await this.productService.deductStock(order.products);
			await this.orderService.updateStatus(orderId, OrderStatus.PENDING);
		}
		catch (error) {
			if (!(error instanceof InsufficientStockError)) {
				throw error
			}

			console.warn(`Stock deduction failed for order ${orderId}. Setting to BACKORDER.`);
			await this.orderService.updateStatus(orderId, OrderStatus.BACKORDER);
		}

		await Promise.all([
			this.cartService.clear(userId),
			this.finalizeCouponUsage(userId, totalAmountInCents, couponCode, providerCouponId)
		]);
	}

	async checkout(
		userId: string,
		customerDetails: CustomerDetails,
		clientItems: ClientItemInput[],
		couponCode?: string
	): Promise<CheckoutSessionDTO> {
		const productIds = clientItems.map(p => p.id)
		const shortProductDTOs = await this.productService.getShortDTOsByIds(productIds);

		if (shortProductDTOs.length !== productIds.length) {
			const foundIds = shortProductDTOs.map(p => p.id);
			throw new EntityNotFoundError("Product", { receivedIds: productIds, foundIds });
		}

		const orderItems = this.formOrderItems(clientItems, shortProductDTOs);

		const initialTotalAmountInCents = this.calculateTotalInCents(orderItems);
		const { totalAmountInCents, appliedCoupon } = await this.applyDiscount(
			initialTotalAmountInCents, userId, couponCode
		);

		const orderCreateInput: OrderCreateInput = {
			products: orderItems,
			totalAmount: Currency.fromCents(totalAmountInCents),
			customerDetails
		}

		const orderDTO = await this.orderService.create(userId, orderCreateInput);

		const sessionCheckoutDTO = await this.paymentProvider.createSession(
			orderDTO.products,
			new PaymentMetadataDTO(orderDTO.id, orderDTO.user.id),
			appliedCoupon
		);

		await this.orderService.updatePaymentSessionId(orderDTO.id, sessionCheckoutDTO.id);

		return sessionCheckoutDTO;
	}

	async webhook(payload: Buffer, headers: Record<string, any>): Promise<void> {
		const event = this.paymentProvider.constructEvent(payload, headers);

		switch (event.type) {
			case PaymentEventTypes.SUCCESS:
				await this.handleWebhookSuccess(event.data);
				break;
			case PaymentEventTypes.UNKNOWN:
			default:
		}
	}
}