import { create } from "zustand";
import { toast } from "react-hot-toast";
import {loadStripe} from "@stripe/stripe-js";

import axios from "../config/axios.js";
import {handleRequestError} from "../utils/errorHandler.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const COUPONS_API_PATH = "/coupons";
const CART_API_PATH = "/cart";
const PAYMENTS_API_PATH = "/payments";

export const useCartStore = create((set, get) => {
	const calculateTotals = () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	};

	return {
		cart: [],
		coupon: null,
		total: 0,
		subtotal: 0,
		isCouponApplied: false,
		paymentLoading: false,
		processingCheckout: false,
		checkoutError: null,

		calculateTotals,

		getMyCoupon: async () => {
			try {
				const res = await axios.get(COUPONS_API_PATH);
				set({ coupon: res.data });
			}
			catch (error) {
				handleRequestError(error, "Error fetching coupon", false);
			}
		},

		applyCoupon: async (code) => {
			try {
				const res = await axios.post(`${COUPONS_API_PATH}/validate`, { code });

				set({ coupon: res.data, isCouponApplied: true });
				get().calculateTotals();

				toast.success("Coupon applied successfully");
			}
			catch (error) {
				handleRequestError(error, "Error applying coupon");
			}
		},

		removeCoupon: async () => {
			set({ coupon: null, isCouponApplied: false });
			get().calculateTotals();

			toast.success("Coupon removed");
		},

		getCartItems: async () => {
			try {
				const res = await axios.get(CART_API_PATH);

				// Normalize server response to a consistent cart item shape
				// Expected shape by UI: { _id, name, description, image, price, quantity }
				const normalized = Array.isArray(res.data)
					? res.data.map((item) => {
						// If server returns { product, quantity }, flatten it
						if (item && item.product) {
							return { ...item.product, quantity: item.quantity };
						}
						return item;
					})
					: [];

				set({ cart: normalized });
				get().calculateTotals();
			}
			catch (error) {
				set({ cart: [] });
				handleRequestError(error, "Error getting cart items");
			}
		},

		addToCart: async (product) => {
			try {
				await axios.post(CART_API_PATH, { productId: product._id });
				toast.success("Product added to cart");

				set((prevState) => {
					// Ensure consistent shape in cart: flatten product fields
					const existingItem = prevState.cart.find((item) => item._id === product._id);

					const newCart = existingItem
						? prevState.cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
						: [ ...prevState.cart, { ...product, quantity: 1 } ];

					return { cart: newCart };
				});

				get().calculateTotals();
			}
			catch (error) {
				handleRequestError(error, "Error adding item to cart");
			}
		},

		removeFromCart: async (productId) => {
			try {
				await axios.delete(`${CART_API_PATH}/${productId}`);

				set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
				get().calculateTotals();
			}
			catch (error) {
				handleRequestError(error, "Error removing item from cart");
			}
		},

		clearCart: async () => {
			try {
				await axios.delete(CART_API_PATH);
				set({ cart: [], coupon: null, total: 0, subtotal: 0 });
			}
			catch (error) {
				handleRequestError(error, "Error clearing cart");
			}
		},

		updateQuantity: async (productId, quantity) => {
			try {
				if (quantity === 0) {
					await get().removeFromCart(productId);
					return;
				}

				await axios.put(`${CART_API_PATH}/${productId}`, { quantity });

				set((prevState) => ({
					cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
				}));
				get().calculateTotals();
			}
			catch (error) {
				handleRequestError(error, "Error updating item quantity in the cart");
			}
		},

		createCheckoutSession: async () => {
			const { cart, coupon } = get();
			set({ paymentLoading: true });

			try {
				const stripe = await stripePromise;

				const res = await axios.post(`${PAYMENTS_API_PATH}/create-checkout-session`, {
					products: cart,
					couponCode: coupon ? coupon.code : null,
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
				handleRequestError(error, "An error occurred during payment");
			}
			finally {
				set({ paymentLoading: false });
			}
		},

		finalizeCheckout: async (sessionId) => {
			set({ processingCheckout: true, checkoutError: null });

			if (!sessionId) {
				set({ processingCheckout: false, checkoutError: "No session ID found in the URL." });
				return;
			}

			try {
				await axios.post(`${PAYMENTS_API_PATH}/checkout-success`, { sessionId });
				await get().clearCart();
			}
			catch (error) {
				set({ checkoutError: "Failed to finalize the order. Please contact support." });
				handleRequestError(error, "Failed to finalize the order. Please contact support.", false);
			}
			finally {
				set({ processingCheckout: false });
			}
		}
	};
});