import Coupon from "../models/Coupon.js";
import {stripe} from "../config/stripe.js";
import Order from "../models/Order.js";

const TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS = process.env.TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS || 20000;

function convertToCents(value) {
	return Math.round(value * 100);
};

function convertToDollars(value) {
	return value / 100;
};

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;
		const userId = req.user._id;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" })
		}

		let initialTotalAmount = 0;

		const lineItems = products.map(product => {
			const amount = convertToCents(product.price);
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
			createNewCoupon(userId).catch(error => {
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
						coupon: await createStripeCoupon(coupon.discountPercentage)
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

		return res.status(200).json({
			id: session.id,
			totalAmount: convertToDollars(totalAmount),
		});
	}
	catch (error) {
		console.error("Error while processing checkout", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
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
				totalAmount: convertToDollars(session.amount_total),
				stripeSessionId: sessionId
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used",
				orderId: newOrder._id
			});
		}
		else {
			res.status(402).json({ message: "Payment confirmation failed" })
		}
	}
	catch (error) {
		console.error("Error while processing successful checkout", error.message);
		return res.status(500).json({ message: error.message });
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once"
	});

	return coupon.id;
};

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = {
		code: "GIFT" + Math.random().toString(36).substr(2, 10).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		userId: userId,
	};

	await newCoupon.save();

	return newCoupon;
};