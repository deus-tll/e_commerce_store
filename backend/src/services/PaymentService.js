import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import {stripe} from "../config/stripe.js";
import {BadRequestError} from "../errors/apiErrors.js";

const TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS = process.env.TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS || 20000;

export class PaymentService {
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

	async #createNewCoupon(userId) {
		await Coupon.findOneAndDelete({ userId });

		const newCoupon = {
			code: "GIFT" + Math.random().toString(36).substr(2, 10).toUpperCase(),
			discountPercentage: 10,
			expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			userId: userId,
		};

		await new Coupon(newCoupon).save();

		return newCoupon;
	};

	async createCheckoutSession(products, couponCode, userId) {
		if (!Array.isArray(products) || products.length === 0) {
			throw new BadRequestError("Invalid or empty products array");
		}

		let initialTotalAmount = 0;

		const lineItems = products.map(product => {
			const amount = this.#convertToCents(product.price);
			initialTotalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let totalAmount = initialTotalAmount;

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId, isActive: true });

			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		if (initialTotalAmount >= TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS) {
			this.#createNewCoupon(userId).catch(error => {
				console.error("Failed to create new coupon:", error);
			});
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
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
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId
					},
					{
						isActive: false,
					}
				);
			}

			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: this.#convertToDollars(session.amount_total),
				stripeSessionId: sessionId
			});

			await newOrder.save();

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