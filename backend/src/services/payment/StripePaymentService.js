import {OrderService} from "../OrderService.js";
import {CouponService} from "../CouponService.js";
import {stripe} from "../../config/stripe.js";
import {BadRequestError} from "../../errors/apiErrors.js";

const APP_URL =
	process.env.NODE_ENV !== "production"
		? process.env.DEVELOPMENT_CLIENT_URL
		: process.env.APP_URL;

const TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS = process.env.TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS || 20000;

export class StripePaymentService {
	constructor() {
		this.orderService = new OrderService();
		this.couponService = new CouponService();
	}

	#convertToCents(value) {
		return Math.round(value * 100);
	};

	#convertToDollars(value) {
		return value / 100;
	};

	async #createStripeCoupon(discountPercentage) {
		const coupon = await stripe.coupons.create({
			percent_off: discountPercentage,
			duration: "once"
		});

		return coupon.id;
	};

	async createCheckoutSession(products, couponCode, userId) {
		if (!Array.isArray(products) || products.length === 0) {
			throw new BadRequestError("Invalid or empty products array");
		}

		let initialTotalAmount = 0;

		const lineItems = products.map(product => {
			const amount = this.#convertToCents(product.price);
			initialTotalAmount += amount * product.quantity;

			const mainImageUrl = product.images?.mainImage;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: mainImageUrl ? [mainImageUrl] : []
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let totalAmount = initialTotalAmount;

		let coupon = null;
		if (couponCode) {
			coupon = await this.couponService.findActiveCouponByCodeAndUser(couponCode, userId);

			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		if (initialTotalAmount >= TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS) {
			this.couponService.createNewGiftCoupon(userId).catch(error => {
				console.error("Failed to create new coupon:", error);
			});
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${APP_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${APP_URL}/purchase-cancel`,
			discounts: coupon
				? [
					{
						coupon: await this.#createStripeCoupon(coupon.discountPercentage)
					}
				] : [],
			metadata: {
				userId: userId.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price
					}))
				)
			}
		});

		return {
			id: session.id,
			totalAmount: this.#convertToDollars(totalAmount),
		};
	}

	async checkoutSuccess(sessionId) {
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			// Idempotency: if an order was already created for this session, return it
			const existingOrder = await this.orderService.findOrderByStripeSessionId(sessionId);
			if (existingOrder) {
				return {
					success: true,
					message: "Payment already processed, returning existing order",
					orderId: existingOrder._id
				};
			}

			if (session.metadata.couponCode) {
				await this.couponService.deactivateCoupon(
					session.metadata.couponCode,
					session.metadata.userId
				);
			}

			const products = JSON.parse(session.metadata.products);
			const totalAmount = this.#convertToDollars(session.amount_total);

			let newOrder;
			try {
				newOrder = await this.orderService.createOrder(
					session.metadata.userId,
					products,
					totalAmount,
					sessionId
				);
			} catch (error) {
				// Handle potential race condition where another request created the order
				if (error && error.code === 11000) {
					const order = await this.orderService.findOrderByStripeSessionId(sessionId);
					if (order) {
						return {
							success: true,
							message: "Payment already processed concurrently, returning existing order",
							orderId: order._id
						};
					}
				}
				throw error;
			}

			return {
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used",
				orderId: newOrder._id
			};
		} else {
			throw new BadRequestError("Payment confirmation failed");
		}
	}
}