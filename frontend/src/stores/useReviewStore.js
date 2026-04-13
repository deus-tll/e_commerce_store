import {create} from "zustand";

import reviewApi from "../api/reviewApi.js";

import {PaginationLimits} from "../constants/app.js";

import {
	getInitialPagination,
	handleAsyncAction,
	handleDeletionNavigation,
	handlePaginatedFetch,
	handleSetPage
} from "../utils/storeHelpers.js";

const prepareReviewData = (data) => ({
	rating: Number(data.rating),
	comment: data.comment?.trim() || ""
});

export const useReviewStore = create((set, get) => ({
	reviews: [],
	pagination: getInitialPagination(PaginationLimits.REVIEWS),
	filters: {},
	loading: false,
	error: null,

	fetchReviewsByProduct: async (productId) => {
		const apiCallWithId = (params) => reviewApi.getAllByProduct(productId, params);

		return await handlePaginatedFetch(
			set, get,
			apiCallWithId,
			(data) => set({
				reviews: data.reviews,
				pagination: data.pagination
			}),
			"Failed to load reviews. Please refresh."
		);
	},
	setPage: async (newPage = 1, productId) => await handleSetPage(set, get, newPage, () => get().fetchReviewsByProduct(productId)),

	createReview: async (productId, reviewData) => {
		const cleanData = prepareReviewData(reviewData);

		return await handleAsyncAction(set, {
			action: () => reviewApi.create(productId, cleanData),
			onSuccess: () => get().setPage(1, productId),
			errorMessage: "Failed to submit review.",
			shouldUpdateStoreError: true
		});
	},

	updateReview: async (reviewId, productId, reviewData) => {
		const cleanData = prepareReviewData(reviewData);

		return await handleAsyncAction(set, {
			action: () => reviewApi.update(reviewId, cleanData),
			onSuccess: () => get().fetchReviewsByProduct(productId),
			errorMessage: "Failed to update review.",
			shouldUpdateStoreError: true
		});
	},

	deleteReview: async (reviewId, productId) => await handleAsyncAction(set, {
		action: () => reviewApi.delete(reviewId),
		onSuccess: () => handleDeletionNavigation(
			get,
			(page) => get().setPage(page, productId),
			() => get().fetchReviewsByProduct(productId)
		),
		errorMessage: "Failed to delete review.",
		handleErrorOptions: { isGlobal: true }
	}),

	clearReviews: () => set({
		reviews: [],
		pagination: getInitialPagination(PaginationLimits.REVIEWS),
		error: null
	}),
	clearError: () => set({ error: null })
}));