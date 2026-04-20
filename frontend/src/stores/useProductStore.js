import {create} from "zustand";

import productApi from "../api/productApi.js";

import {PAGINATION_LIMITS} from "../constants/app.js";
import {
	getInitialPagination,
	handleAsyncAction, handleClearFilters,
	handleDeletionNavigation,
	handlePaginatedFetch,
	handleSetPage, handleUpdateFilter, STORE_SORT_KEY
} from "../utils/storeHelpers.js";

export const ProductFilterKeys = Object.freeze({
	SEARCH: "search",
	CATEGORY_SLUG: "categorySlug",
	ATTRIBUTES: "attributes",
	SORT: STORE_SORT_KEY
});

const INITIAL_PRODUCT_FILTERS = Object.freeze({
	search: "",
	categorySlug: "",
	attributes: {},
	sort: {
		sortBy: "createdAt",
		order: "desc"
	}
});

const _toggleAttributeFilter = (currentAttributes, name, value) => {
	const attributes = { ...currentAttributes };
	const values = attributes[name] || [];

	const nextValues =  values.includes(value)
		? values.filter(v => v !== value)
		: [...values, value];

	if (nextValues.length === 0) {
		delete attributes[name];
	}
	else {
		attributes[name] = nextValues;
	}

	return attributes;
};

export const useProductStore = create((set, get) => ({
	products: [],
	pagination: getInitialPagination(PAGINATION_LIMITS.PRODUCTS),
	filters: INITIAL_PRODUCT_FILTERS,

	featuredProducts: [],
	recommendations: [],

	currentProduct: null,

	facets: [],
	facetsLoading: false,

	loading: false,
	featuredProductsLoading: false,
	error: null,

	fetchProducts: async () => await handlePaginatedFetch(
		set, get,
		productApi.getAll,
		(data) => set({ products: data.products, pagination: data.pagination }),
		"Failed to load products. Please refresh."
	),
	setPage: async (newPage = 1) => await handleSetPage(set, get, newPage, get().fetchProducts),

	fetchProductById: async (productId) => {
		const isNewProduct = get().currentProduct?.id !== productId;

		return await handleAsyncAction(set, {
			action: () => productApi.getById(productId),
			onSuccess: (res) => set({ currentProduct: res.data }),
			setLoading: (val) => isNewProduct ? set({ loading: val }) : null,
			errorMessage: "Failed to load product details.",
			shouldUpdateStoreError: true
		});
	},
	fetchFeaturedProducts: async () => await handleAsyncAction(set, {
		action: () => productApi.getFeatured(),
		onSuccess: (res) => set({ featuredProducts: res.data }),
		setLoading: (val) => set({ featuredProductsLoading: val }),
		errorMessage: "Failed to load featured products. Please refresh.",
		shouldUpdateStoreError: false,
		handleErrorOptions: { isGlobal: true }
	}),
	fetchRecommendations: async () => await handleAsyncAction(set, {
		action: () => productApi.getRecommendations(),
		onSuccess: (res) => set({ recommendations: res.data }),
		errorMessage: "Failed to load recommendations.",
		shouldUpdateStoreError: false,
		handleErrorOptions: { isGlobal: true }
	}),
	fetchFacets: async (categoryId) => await handleAsyncAction(set, {
		action: () => productApi.getFacets(categoryId),
		onSuccess: (res) => set({ facets: res.data }),
		onError: () => set({ facets: [] }),
		setLoading: (val) => set({ facetsLoading: val }),
		shouldUpdateStoreError: false
	}),

	createProduct: async (productData) => await handleAsyncAction(set, {
		action: () => productApi.create(productData),
		onSuccess: () => get().setPage(1),
		errorMessage: "Product creation failed.",
		shouldUpdateStoreError: true
	}),
	updateProduct: async (productId, productData) => await handleAsyncAction(set, {
		action: () => productApi.update(productId, productData),
		onSuccess: () => get().fetchProducts(),
		errorMessage: "Product update failed.",
		shouldUpdateStoreError: true
	}),
	deleteProduct: async (productId) => await handleAsyncAction(set, {
		action: () => productApi.delete(productId),
		onSuccess: () => handleDeletionNavigation(get, get().setPage, get().fetchProducts),
		errorMessage: "Product deletion failed.",
		shouldUpdateStoreError: false,
		handleErrorOptions: { isGlobal: true }
	}),
	toggleFeaturedProduct: async (productId) => await handleAsyncAction(set, {
		action: () => productApi.toggleFeatured(productId),
		onSuccess: (res) => {
			const updatedProduct = res.data;

			set((state) => ({
				products: state.products.map(p => p.id === productId ? updatedProduct : p),
				featuredProducts: updatedProduct.isFeatured
					? [...state.featuredProducts.filter(p => p.id !== productId), updatedProduct]
					: state.featuredProducts.filter(p => p.id !== productId)
			}));
		},
		errorMessage: "Failed to toggle featured status.",
		shouldUpdateStoreError: false,
		handleErrorOptions: { isGlobal: true }
	}),

	updateFilter: async (key, value) => {
		let finalValue = value;

		if (key === ProductFilterKeys.ATTRIBUTES) {
			const { name: attrName, value: attrValue } = value;

			if (attrName && attrValue) {
				finalValue = _toggleAttributeFilter(get().filters.attributes, attrName, attrValue);
			}
		}

		await handleUpdateFilter(set, get().fetchProducts, key, finalValue);
	},

	clearFilters: () => handleClearFilters(
		set, get().fetchProducts, INITIAL_PRODUCT_FILTERS, false, { limit: PAGINATION_LIMITS.PRODUCTS }
	),
	clearFiltersAndFetch: async () => await handleClearFilters(
		set, get().fetchProducts, INITIAL_PRODUCT_FILTERS, true, { limit: PAGINATION_LIMITS.PRODUCTS }
	),

	clearCurrentProduct: () => set({ currentProduct: null }),
	clearFeaturedProducts: () => set({ featuredProducts: [] }),
	clearError: () => set({ error: null }),
}));