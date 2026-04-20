import {create} from "zustand";

import categoryApi from "../api/categoryApi.js";

import {PAGINATION_LIMITS, PAGINATION_MAX_LIMITS} from "../constants/app.js";

import {
	getInitialPagination,
	handleAsyncAction, handleClearFilters,
	handleDeletionNavigation,
	handlePaginatedFetch,
	handleSetPage, handleUpdateFilter
} from "../utils/storeHelpers.js";

export const CategoryFilterKeys = Object.freeze({
	SEARCH: "search",
});

const INITIAL_CATEGORY_FILTERS = Object.freeze({
	search: ""
});

export const useCategoryStore = create((set, get) => ({
	categories: [],
	pagination: getInitialPagination(PAGINATION_LIMITS.CATEGORIES),
	filters: INITIAL_CATEGORY_FILTERS,

	searchResults: [],
	searchLoading: false,

	currentCategory: null,

	loading: false,
	error: null,

	fetchCategories: async (options = {}) => {
		const { append = false } = options;

		return await handlePaginatedFetch(
			set, get,
			categoryApi.getAll,
			(data) => {
				const { categories: newCategories, pagination: newPagination } = data;

				set((prev) => ({
					categories: (append && prev.pagination.page !== 1) ? [...prev.categories, ...newCategories] : newCategories,
					pagination: newPagination
				}));
			},
			"Failed to load categories. Please refresh."
		);
	},
	setPage: async (newPage = 1, options = {}) => await handleSetPage(set, get, newPage, () => get().fetchCategories(options)),

	searchCategories: async (term) => await handleAsyncAction(set, {
		action: () => categoryApi.getAll({
			page: 1,
			limit: PAGINATION_MAX_LIMITS.CATEGORIES,
			search: term
		}),
		onSuccess: (res) => set({ searchResults: res.data.categories }),
		onError: () => set({ searchResults: [] }),
		setLoading: (val) => set({ searchLoading: val }),
		shouldUpdateStoreError: false,
		handleErrorOptions: { showToast: true }
	}),

	fetchCategoryBySlug: async (slug) => await handleAsyncAction(set, {
		action: () => categoryApi.getBySlug(slug),
		onSuccess: (res) => set({ currentCategory: res.data }),
		onError: () => set({ currentCategory: null }),
		errorMessage: "Failed to load category details.",
		shouldUpdateStoreError: false,
		handleErrorOptions: { isGlobal: true }
	}),

	createCategory: async (categoryData) => await handleAsyncAction(set, {
		action: () => categoryApi.create(categoryData),
		onSuccess: () => get().setPage(1),
		errorMessage: "Category creation failed.",
		shouldUpdateStoreError: true
	}),

	updateCategory: async (categoryId, categoryData) => await handleAsyncAction(set, {
		action: () => categoryApi.update(categoryId, categoryData),
		onSuccess: () => get().fetchCategories(),
		errorMessage: "Category update failed.",
		shouldUpdateStoreError: true
	}),

	deleteCategory: async (categoryId) => await handleAsyncAction(set, {
		action: () => categoryApi.delete(categoryId),
		onSuccess: () => handleDeletionNavigation(get, get().setPage, get().fetchCategories),
		errorMessage: "Category deletion failed.",
		shouldUpdateStoreError: false,
		handleErrorOptions: { isGlobal: true }
	}),

	updateFilter: async (key, value) => await handleUpdateFilter(set, get().fetchCategories, key, value),

	clearFilters: () => handleClearFilters(
		set, get().fetchCategories,
		INITIAL_CATEGORY_FILTERS, false,
		{ limit: PAGINATION_LIMITS.CATEGORIES }
	),
	clearFiltersAndFetch: () => handleClearFilters(
		set, get().fetchCategories,
		INITIAL_CATEGORY_FILTERS, true,
		{ limit: PAGINATION_LIMITS.CATEGORIES }
	),

	clearCategories: () => set({ categories: [] }),
	clearSearchResults: () => set({ searchResults: [], searchLoading: false }),
	clearCurrentCategory: () => set({ currentCategory: null }),
	clearError: () => set({ error: null })
}));