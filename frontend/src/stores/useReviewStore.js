import { create } from "zustand";

import axios from "../config/axios.js";
import { handleError } from "../utils/errorHandler.js";
import {PaginationLimits} from "../constants/app.js";

export const REVIEWS_API_PATH = "/reviews";

export const useReviewStore = create((set, get) => ({
	reviews: [],
	pagination: null,
	loading: false,
	page: 1,

	fetchReviewsByProduct: async (productId) => {
		const currentPage = get().page;
		const limit = PaginationLimits.REVIEWS;

		set({ loading: true });

		try {
			const params = new URLSearchParams({
				page: String(currentPage),
				limit: String(limit)
			});

			const res = await axios.get(`${REVIEWS_API_PATH}/product/${productId}?${params}`);

			set({
				reviews: res.data.reviews || [],
				pagination: res.data.pagination || null
			});

			return true;
		}
		catch (error) {
			handleError(error, "Failed to load reviews. Please refresh.", {
				isGlobal: true,
				showToast: false
			});

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	createReview: async (productId, reviewData) => {
		set({ loading: true, error: null });

		try {
			await axios.post(`${REVIEWS_API_PATH}/product/${productId}`, {
				rating: Number(reviewData.rating),
				comment: reviewData.comment.trim()
			});

			if (get().page === 1) {
				await get().fetchReviewsByProduct(productId);
			}

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Failed to submit review.", {
				isGlobal: false,
				showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set((state) => ({
				loading: false,
				...(state.page !== 1 && { page: 1 })
			}));
		}
	},

	updateReview: async (productId, reviewId, reviewData) => {
		set({ loading: true, error: null });

		try {
			await axios.patch(`${REVIEWS_API_PATH}/${reviewId}`, {
				rating: Number(reviewData.rating),
				comment: reviewData.comment.trim()
			});

			await get().fetchReviewsByProduct(productId);

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Failed to update review.", {
				isGlobal: false,
				showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	deleteReview: async (productId, reviewId) => {
		set({ loading: true });

		try {
			await axios.delete(`${REVIEWS_API_PATH}/${reviewId}`);

			await get().fetchReviewsByProduct(productId);

			return true;
		}
		catch (error) {
			handleError(error, "Failed to delete review.", {
				isGlobal: true,
				showToast: false
			});

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	setPage: (page) => set({ page }),
	clearReviews: () => set({ reviews: [], pagination: null, error: null, page: 1 }),
	clearError: () => set({ error: null })

	// fetchReviewsByRating: (rating) => {
	//
	// },
	//
	// getRatingDistribution: () => {
	//
	// }
}));