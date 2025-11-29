import {create} from "zustand";
import {toast} from "react-hot-toast";
import {loadStripe} from "@stripe/stripe-js";

import axios from "../config/axios.js";
import {handleError} from "../utils/errorHandler.js";

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
		couponLoading: false,
		paymentLoading: false,
		processingCheckout: false,
		checkoutError: null,
		itemLoadingId: null,
		clearingCart: false,
		lastOrderNumber: null,

		calculateTotals,

		clear: () => {
			set({
				cart: [],
				coupon: null,
				total: 0,
				subtotal: 0
			});
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
				get().calculateTotals();

				toast.success("Coupon applied successfully");
			}
			catch (error) {
				handleError(error, "Error applying coupon", {
					isGlobal: false, showToast: true
				});
				throw error;
			}
			finally {
				set({ couponLoading: false });
			}
		},

		removeCoupon: () => {
			set({ coupon: null, isCouponApplied: false });
			get().calculateTotals();

			toast.success("Coupon removed");
		},

		getCartItems: async () => {
			try {
				const res = await axios.get(CART_API_PATH);

				const normalized = Array.isArray(res.data)
					? res.data.map((item) => {
						if (!item || !item.product) {
							return null;
						}
						return {
							id: item.product.id,
							name: item.product.name,
							price: item.product.price,
							image: item.product.image,
							quantity: item.quantity,
						};
					}).filter(item => item !== null)
					: [];

				set({ cart: normalized });
				get().calculateTotals();
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
				toast.success("Product added to your cart");

				set((prevState) => {
					const existingItem = prevState.cart.find((item) => item.id === product.id);

					const newCart = existingItem
						? prevState.cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
						: [ ...prevState.cart, { ...product, quantity: 1 } ];

					return { cart: newCart };
				});

				get().calculateTotals();
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
				get().calculateTotals();
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
				get().calculateTotals();
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
			const { cart, coupon } = get();
			set({ paymentLoading: true });

			try {
				const stripe = await stripePromise;

				const simplifiedProducts = cart.map(p => ({
					id: p.id,
					quantity: p.quantity || 1
				}));

				const res = await axios.post(`${PAYMENTS_API_PATH}/create-checkout-session`, {
					products: simplifiedProducts,
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
	};
});