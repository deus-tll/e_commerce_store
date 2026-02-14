import {create} from "zustand";
import {toast} from "react-hot-toast";
import {loadStripe} from "@stripe/stripe-js";

import axios from "../config/axios.js";

import {handleError} from "../utils/errorHandler.js";
import {Currency} from "../utils/currency.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const COUPONS_API_PATH = "/coupons";
const CART_API_PATH = "/cart";
const PAYMENTS_API_PATH = "/payments";

const normalizeProduct = (product, quantity = 1) => ({
	id: product.id,
	name: product.name,
	price: product.price,
	stock: product.stock,
	image: product.image || product.images?.mainImage,
	quantity: quantity,
});

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	isCouponApplied: false,
	couponLoading: false,
	paymentLoading: false,
	processingCheckout: false,
	checkoutError: null,
	itemLoadingId: null,
	clearingCart: false,
	lastOrderNumber: null,

	getTotals: () => {
		const { cart, coupon, isCouponApplied } = get();

		const originalPriceInCents = cart.reduce((sum, item) => {
			return sum + (Currency.toCents(item.price) * item.quantity);
		}, 0);

		let totalPriceInCents = originalPriceInCents;

		if (coupon && isCouponApplied) {
			const percentage = Number(coupon.discountPercentage) || 0;
			const discountInCents = Math.round(originalPriceInCents * (percentage / 100));
			totalPriceInCents = originalPriceInCents - discountInCents;
		}

		return {
			originalPrice: Currency.fromCents(originalPriceInCents),
			totalPrice: Currency.fromCents(totalPriceInCents),
			savings: Currency.fromCents(originalPriceInCents - totalPriceInCents),
		};
	},

	getMyCoupon: async () => {
		try {
			const res = await axios.get(COUPONS_API_PATH);
			set({ coupon: res.data });
		}
		catch (error) {
			handleError(error, "Error fetching coupon", {
				isGlobal: false, showToast: false
			});
		}
	},

	applyCoupon: async (code) => {
		set({ couponLoading: true });

		try {
			const res = await axios.post(`${COUPONS_API_PATH}/validate`, { code });

			set({ coupon: res.data, isCouponApplied: true });

			toast.success("Coupon applied successfully");
		}
		catch (error) {
			const msg = handleError(error, "Error applying coupon", {
				isGlobal: false, showToast: false
			});
			throw new Error(msg);
		}
		finally {
			set({ couponLoading: false });
		}
	},

	unapplyCoupon: () => {
		set({ isCouponApplied: false });

		toast.success("Coupon unapplied");
	},

	clear: () => {
		set({
			cart: [],
			isCouponApplied: false
		});
	},

	getCartItems: async () => {
		try {
			const res = await axios.get(CART_API_PATH);

			const normalized = Array.isArray(res.data)
				? res.data
					.map((item) => item?.product ? normalizeProduct(item.product, item.quantity) : null)
					.filter(item => item !== null)
				: [];

			set({ cart: normalized });
		}
		catch (error) {
			set({ cart: [] });
			handleError(error, "Error getting cart items");
		}
	},

	addToCart: async (product) => {
		set({ itemLoadingId: product.id });

		try {
			await axios.post(CART_API_PATH, { productId: product.id });

			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item.id === product.id);

				if (existingItem) {
					return {
						cart: prevState.cart.map((item) =>
							item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
						),
					};
				}

				return {
					cart: [...prevState.cart, normalizeProduct(product, 1)]
				};
			});

			toast.success("Product added to your cart");
		}
		catch (error) {
			handleError(error, "Error adding item to cart", {
				isGlobal: false,
				showToast: true
			});
		}
		finally {
			set({ itemLoadingId: null });
		}
	},

	removeFromCart: async (productId) => {
		set({ itemLoadingId: productId });

		try {
			await axios.delete(`${CART_API_PATH}/${productId}`);

			set((prevState) => ({ cart: prevState.cart.filter((item) => item.id !== productId) }));
		}
		catch (error) {
			handleError(error, "Error removing item from cart", {
				isGlobal: false,
				showToast: true
			});
		}
		finally {
			set({ itemLoadingId: null });
		}
	},

	clearCart: async () => {
		set({ clearingCart: true });

		try {
			await axios.delete(CART_API_PATH);

			get().clear();

			toast.success("Your cart has been cleared.");
		}
		catch (error) {
			handleError(error, "Error clearing cart", {
				isGlobal: false,
				showToast: true
			});
		}
		finally {
			set({ clearingCart: false });
		}
	},

	updateQuantity: async (productId, quantity) => {
		set({ itemLoadingId: productId });

		try {
			await axios.patch(`${CART_API_PATH}/${productId}`, { quantity });

			set((prevState) => ({
				cart: prevState.cart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
			}));
		}
		catch (error) {
			handleError(error, "Error updating item quantity in the cart", {
				isGlobal: false,
				showToast: true
			});
		}
		finally {
			set({ itemLoadingId: null });
		}
	},

	createCheckoutSession: async () => {
		const { cart, coupon, isCouponApplied } = get();
		set({ paymentLoading: true });

		try {
			const stripe = await stripePromise;

			const simplifiedProducts = cart.map(p => ({
				id: p.id,
				quantity: p.quantity || 1
			}));

			const res = await axios.post(`${PAYMENTS_API_PATH}/create-checkout-session`, {
				products: simplifiedProducts,
				couponCode: (coupon && isCouponApplied) ? coupon.code : null,
			});

			const session = res?.data;
			const result = await stripe.redirectToCheckout({
				sessionId: session.id,
			});

			if (result.error) {
				throw result.error;
			}
		}
		catch (error) {
			const criticalOptions = { isGlobal: true, showToast: false };

			if (error && error.type === 'StripeError' || (error.message && !error.response)) {
				const userMessage = "Payment checkout could not be initiated. Please try again or contact support.";

				handleError(error, userMessage, {
					...criticalOptions,
					forceUserMessage: true
				});
				return;
			}

			handleError(error, "An error occurred during payment", criticalOptions);
		}
		finally {
			set({ paymentLoading: false });
		}
	},

	finalizeCheckout: async (sessionId) => {
		set({ processingCheckout: true, checkoutError: null, lastOrderNumber: null });

		if (!sessionId) {
			set({ processingCheckout: false, checkoutError: "No session ID found in the URL." });
			return;
		}

		try {
			const res = await axios.post(`${PAYMENTS_API_PATH}/checkout-success`, { sessionId });
			const orderData = res.data;

			get().clear();

			set({ lastOrderNumber: orderData.orderNumber });
		}
		catch (error) {
			set({ checkoutError: "Failed to finalize the order. Please contact support." });
			handleError(error, "Failed to finalize the order. Please contact support.", {
				isGlobal: true,
				showToast: false
			});
		}
		finally {
			set({ processingCheckout: false });
		}
	}
}));