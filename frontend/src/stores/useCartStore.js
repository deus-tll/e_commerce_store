import {create} from "zustand";
import {loadStripe} from "@stripe/stripe-js";
import {toast} from "react-hot-toast";

import couponApi from "../api/couponApi.js";
import cartApi from "../api/cartApi.js";
import paymentApi from "../api/paymentApi.js";

import {Currency} from "../utils/currency.js";
import {handleError} from "../utils/errorHandler.js";
import {handleAsyncAction} from "../utils/storeHelpers.js";
import orderApi from "../api/orderApi.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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

	getMyCoupon: async () => await handleAsyncAction(set, {
		action: () => couponApi.get(),
		onSuccess: (res) => set({ coupon: res.data }),
		errorMessage: "Error fetching coupon"
	}),

	applyCoupon: async (code) => await handleAsyncAction(set, {
		action: () => couponApi.apply(code),
		onSuccess: (res) => {
			set({ coupon: res.data, isCouponApplied: true });
			toast.success("Coupon applied successfully");
		},
		setLoading: (val) => set({ couponLoading: val }),
		errorMessage: "Error applying coupon"
	}),

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

	getCartItems: async () => await handleAsyncAction(set, {
		action: () => cartApi.get(),
		onSuccess: (res) => {
			const normalized = Array.isArray(res.data)
				? res.data
					.map((item) => item?.product ? normalizeProduct(item.product, item.quantity) : null)
					.filter(item => item !== null)
				: [];
			set({ cart: normalized });
		},
		onError: () => set({ cart: [] }),
		errorMessage: "Error getting cart items",
		handleErrorOptions: { showToast: true }
	}),

	addToCart: async (product) => await handleAsyncAction(set, {
		action: () => cartApi.addToCart(product.id),
		onSuccess: () => {
			set((prevState) => {
				const existingItem = prevState.cart.find((item) => item.id === product.id);
				if (existingItem) {
					return {
						cart: prevState.cart.map((item) =>
							item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
						),
					};
				}
				return { cart: [...prevState.cart, normalizeProduct(product, 1)] };
			});

			toast.success("Product added to your cart");
		},
		setLoading: (val) => set({ itemLoadingId: val ? product.id : null }),
		errorMessage: "Error adding item to cart",
		handleErrorOptions: { showToast: true }
	}),

	removeFromCart: async (productId) => await handleAsyncAction(set, {
		action: () => cartApi.removeFromCart(productId),
		onSuccess: () => set((state) => ({
			cart: state.cart.filter((item) => item.id !== productId)
		})),
		setLoading: (val) => set({ itemLoadingId: val ? productId : null }),
		errorMessage: "Error removing item from cart",
		handleErrorOptions: { showToast: true }
	}),

	clearCart: async () => await handleAsyncAction(set, {
		action: () => cartApi.clear(),
		onSuccess: () => {
			get().clear();
			toast.success("Your cart has been cleared.");
		},
		setLoading: (val) => set({ clearingCart: val }),
		errorMessage: "Error clearing cart",
		handleErrorOptions: { showToast: true }
	}),

	updateQuantity: async (productId, quantity) => await handleAsyncAction(set, {
		action: () => cartApi.updateQuantity(productId, quantity),
		onSuccess: () => set((state) => ({
			cart: state.cart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
		})),
		setLoading: (val) => set({ itemLoadingId: val ? productId : null }),
		errorMessage: "Error updating item quantity",
		handleErrorOptions: { showToast: true }
	}),

	createCheckoutSession: async (customerDetails) => await handleAsyncAction(set, {
		action: async () => {
			const { cart, coupon, isCouponApplied } = get();
			const stripe = await stripePromise;
			const couponCode = (coupon && isCouponApplied) ? coupon.code : null;

			const apiResult = await paymentApi.createCheckoutSession(
				cart.map(p => ({ id: p.id, quantity: p.quantity || 1 })),
				couponCode,
				customerDetails
			);

			if (!apiResult?.data?.id) {
				throw new Error("Failed to create checkout session: No ID returned");
			}

			const stripeResult = await stripe.redirectToCheckout({
				sessionId: apiResult.data.id
			});

			if (stripeResult.error) throw stripeResult.error;

			return apiResult;
		},
		setLoading: (val) => set({ paymentLoading: val }),
		onError: (error, preventDefault) => {
			preventDefault();

			const criticalOptions = { isGlobal: true };

			if (error?.type === "StripeError" || (error?.message && !error?.response)) {
				handleError(error, "Payment checkout could not be initiated...", {
					...criticalOptions,
					forceUserMessage: true
				});
				return;
			}

			handleError(error, "An error occurred during payment", criticalOptions);
		}
	}),

	finalizeCheckout: async (sessionId) => {
		set({ lastOrderNumber: null, checkoutError: null, processingCheckout: true });

		if (!sessionId) {
			set({ checkoutError: "No session ID found.", processingCheckout: false });
			return false;
		}

		const maxAttempts = 5;
		const delay = 3000;

		for (let i = 0; i < maxAttempts; i++) {
			try {
				const res = await orderApi.getPaymentStatus(sessionId);

				if (res.data.isPaid) {
					get().clear();
					set({ lastOrderNumber: res.data.orderNumber, processingCheckout: false });

					return true;
				}
			}
			catch (error) {
				console.warn(`Attempt ${i + 1} failed:`, error.message);
			}

			if (i < maxAttempts - 1) {
				await new Promise(resolve => setTimeout(resolve, delay));
			}
		}

		set({
			checkoutError: "We're still waiting for payment confirmation. Don't worry, we'll email you once it's processed.",
			processingCheckout: false
		});
	}
}));