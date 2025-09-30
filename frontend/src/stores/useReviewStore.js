import { create } from "zustand";

import axios from "../config/axios.js";
import { handleRequestError } from "../utils/errorHandler.js";

export const REVIEWS_API_PATH = "/reviews";

export const useReviewStore = create((set, get) => ({
	reviews: [],
	pagination: null,
	loading: false,
	submitting: false,

	createReview: async (productId, reviewData) => {
		set({ submitting: true });

		try {
			const res = await axios.post(`${REVIEWS_API_PATH}/product/${productId}`, {
				rating: Number(reviewData.rating),
				comment: reviewData.comment.trim()
			});

			set((prevState) => ({
				reviews: [res.data, ...prevState.reviews],
				pagination: prevState.pagination
					? { ...prevState.pagination, total: (prevState.pagination.total || 0) + 1 }
					: prevState.pagination
			}));

			return res.data;
		}
		catch (error) {
			handleRequestError(error, "Failed to submit review");
			throw error;
		}
		finally {
			set({ submitting: false });
		}
	},

	fetchReviewsByProduct: async (productId, page = 1, limit = 10) => {
		set({ loading: true });

		try {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit)
			});

			const res = await axios.get(`${REVIEWS_API_PATH}/product/${productId}?${params}`);

			set({
				reviews: res.data.reviews || [],
				pagination: res.data.pagination || null
			});
		}
		catch (error) {
			handleRequestError(error, "Failed to load reviews", false);
		}
		finally {
			set({ loading: false });
		}
	},

	updateReview: async (reviewId, reviewData) => {
		set({ submitting: true });

		try {
			const res = await axios.put(`${REVIEWS_API_PATH}/${reviewId}`, {
				rating: Number(reviewData.rating),
				comment: reviewData.comment.trim()
			});

			set((prevState) => ({
				reviews: prevState.reviews.map(review =>
					review._id === reviewId ? res.data : review
				)
			}));

			return res.data;
		}
		catch (error) {
			handleRequestError(error, "Failed to update review");
			throw error;
		}
		finally {
			set({ submitting: false });
		}
	},

	deleteReview: async (reviewId) => {
		set({ loading: true });

		try {
			await axios.delete(`${REVIEWS_API_PATH}/${reviewId}`);

			set((prevState) => ({
				reviews: prevState.reviews.filter(review => review._id !== reviewId),
				pagination: prevState.pagination
					? { ...prevState.pagination, total: Math.max(0, (prevState.pagination.total || 0) - 1) }
					: prevState.pagination
			}));
		}
		catch (error) {
			handleRequestError(error, "Failed to delete review");
		}
		finally {
			set({ loading: false });
		}
	},

	clearReviews: () => set({
		reviews: [],
		pagination: null
	}),

	getAverageRating: () => {
		return 4.8;
	},
	getTotalReviews: () => {
		return get()?.pagination?.total;
	},
	// getReviewsByRating: (rating) => {
	//
	// },
	//
	// getRatingDistribution: () => {
	//
	// }
}));