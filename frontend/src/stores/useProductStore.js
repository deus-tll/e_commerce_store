import {create} from "zustand";
import qs from "qs";

import axios from "../config/axios.js";

import {handleError} from "../utils/errorHandler.js";

import {PaginationLimits} from "../constants/app.js";

export const PRODUCTS_API_PATH = "/products";

export const useProductStore = create((set, get) => ({
	products: [],
	pagination: null,
	facets: [],
	currentProduct: null,
	featuredProducts: [],
	recommendations: [],
	loading: false,
	error: null,

	fetchProducts: async (options = {}) => {
		const {
			page = 1,
			limit = PaginationLimits.PRODUCTS,
			filters = {}
		} = options;

		set({ loading: true });

		try {
			const queryString = qs.stringify(
				{
					page,
					limit,
					...filters
				},
				{
					arrayFormat: 'indices',
					encode: false,
					skipNulls: true
				}
			);

			const res = await axios.get(`${PRODUCTS_API_PATH}?${queryString}`);

			set({ products: res.data.products, pagination: res.data.pagination });

			return true;
		}
		catch (error) {
			handleError(error, "Failed to load products. Please try refreshing the page.", {
				isGlobal: true,
				showToast: false,
				forceUserMessage: true
			});
			set({ products: [], pagination: null });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	fetchProductById: async (id) => {
		if (get().currentProduct?.id !== id) {
			set({ loading: true });
		}

		set({ error: null });

		try {
			const res = await axios.get(`${PRODUCTS_API_PATH}/${id}`);
			set({ currentProduct: res.data });

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Failed to load product details. Please try refreshing.", {
				isGlobal: false,
				showToast: false
			});
			set({ currentProduct: null, error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	createProduct: async (productData) => {
		set({ loading: true, error: null });

		const currentPage = get().pagination?.page || 1;

		try {
			await axios.post(PRODUCTS_API_PATH, productData);

			await get().fetchProducts({ page: currentPage });

			return true;
		}
        catch (error) {
	        const msg = handleError(error, "Product creation failed.", {
				isGlobal: false, showToast: false
			});
	        set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	updateProduct: async (productId, productData) => {
		set({ loading: true, error: null });

		const currentPage = get().pagination?.page || 1;

		try {
			await axios.patch(`${PRODUCTS_API_PATH}/${productId}`, productData);

			await get().fetchProducts({ page: currentPage });

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Product update failed.", {
				isGlobal: false, showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	deleteProduct: async (productId) => {
		set({ loading: true });

		const state = get();
		const currentPage = state.pagination?.page || 1;
		const limit = state.pagination?.limit || PaginationLimits.PRODUCTS;
		const oldTotal = state.pagination?.totalPrice || 0;

		try {
			await axios.delete(`${PRODUCTS_API_PATH}/${productId}`);

			const newTotal = oldTotal > 0 ? oldTotal - 1 : 0;
			const maxPage = Math.ceil(newTotal / limit) || 1;
			const pageToFetch = currentPage > maxPage ? maxPage : currentPage;

			await get().fetchProducts({ page: pageToFetch });

			return true;
		}
        catch (error) {
	        handleError(error, "Product deletion failed.", {
				isGlobal: true, showToast: false
			});

	        return false;
		}
		finally {
			set({ loading: false });
		}
	},

	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });

		try {
			const res = await axios.patch(`${PRODUCTS_API_PATH}/${productId}/featured`);
			const updatedProduct = res.data;

			set((prevState) => {

				const updatedProducts = prevState.products.map((product) =>
					product.id === productId
						? { ...product, isFeatured: updatedProduct.isFeatured }
						: product
				);

				let updatedFeaturedProducts;
				if (updatedProduct.isFeatured) {
					updatedFeaturedProducts = [...prevState.featuredProducts, updatedProduct];
				} else {
					updatedFeaturedProducts = prevState.featuredProducts.filter(
						(product) => product.id !== productId
					);
				}

				return {
					products: updatedProducts,
					featuredProducts: updatedFeaturedProducts
				};
			});

			return true;
		}
        catch (error) {
	        handleError(error, "Failed to toggle featured status.", {
				isGlobal: true, showToast: false
			});

	        return false;
		}
		finally {
			set({ loading: false });
		}
	},

	fetchFeaturedProducts: async () => {
		set({ loading: true });

		try {
			const res = await axios.get(`${PRODUCTS_API_PATH}/featured`);
			set({ featuredProducts: res.data });

			return true;
		}
		catch (error) {
			handleError(error, "Failed to load featured products.", {
				isGlobal: true, showToast: false
			});

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	fetchFacets: async (categoryId) => {
		try {
			const res = await axios.get(`${PRODUCTS_API_PATH}/categories/${categoryId}/facets`);

			set({ facets: res.data });
			return true;
		}
		// eslint-disable-next-line no-unused-vars
		catch (error) {
			set({ facets: [] });
			return false;
		}
	},

	fetchRecommendations: async () => {
		set({ loading: true });

		try {
			const res = await axios.get(`${PRODUCTS_API_PATH}/recommended`);
			set({ recommendations: res.data });

			return true;
		}
		catch (error) {
			handleError(error, "Failed to load recommendations.", {
				isGlobal: true,
				showToast: false
			});

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	clearCurrentProduct: () => set({ currentProduct: null }),
	clearError: () => set({ error: null }),
}));