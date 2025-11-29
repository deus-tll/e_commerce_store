import { create } from "zustand";

import axios from "../config/axios.js";
import {handleError} from "../utils/errorHandler.js";

export const PRODUCTS_API_PATH = "/products";

export const useProductStore = create((set, get) => ({
	products: [],
	pagination: null,
	featuredProducts: [],
	currentProduct: null,
	loading: false,

	createProduct: async (productData) => {
		set({ loading: true });

		try {
			const res = await axios.post(PRODUCTS_API_PATH, productData);
			set((prevState) => ({
				products: [ ...prevState.products, res.data ]
			}));
		}
        catch (error) {
            handleError(error, "An error occurred", false);
		}
		finally {
			set({ loading: false });
		}
	},

	clearCurrentProduct: () => set({ currentProduct: null }),

	fetchProductById: async (productId) => {
		set({ loading: true });

		try {
			const res = await axios.get(`${PRODUCTS_API_PATH}/${productId}`);
			set({ currentProduct: res.data });
			return res.data;
		}
		catch (error) {
			handleError(error, "An error occurred", false);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	updateProduct: async (productId, productData) => {
		set({ loading: true });

		try {
			const res = await axios.put(`${PRODUCTS_API_PATH}/${productId}`, productData);
			// refresh current page after update if pagination exists
			const { pagination } = get();
			if (pagination) {
				await get().fetchAllProducts(pagination.page, pagination.limit);
			} else {
				set((prev) => ({
					products: prev.products.map(p => p._id === productId ? res.data : p)
				}));
			}
			return res.data;
		}
		catch (error) {
			handleError(error, "An error occurred", false);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	fetchProducts: async (page = 1, limit = 10, filters = {}) => {
		set({ loading: true });

		try {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				...filters
			});

			const res = await axios.get(`${PRODUCTS_API_PATH}?${params}`);

			const { products: newProducts, pagination: newPagination } = res.data;
			set({ products: newProducts, pagination: newPagination });
		}
		catch (error) {
			handleError(error, "An error occurred while fetching products", false);
			set({ products: [], pagination: null });
		}
		finally {
			set({ loading: false });
		}
	},

	deleteProduct: async (productId) => {
		set({ loading: true });

		try {
			await axios.delete(`${PRODUCTS_API_PATH}/${productId}`);
			set((prevState) => ({
				products: prevState.products.filter((product) => product._id !== productId)
			}));
		}
        catch (error) {
            handleError(error, "An error occurred", false);
		}
		finally {
			set({ loading: false });
		}
	},

	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });

		try {
			const res = await axios.patch(`${PRODUCTS_API_PATH}/${productId}`);
			const updatedProduct = res.data;

			set((prevState) => {

				const updatedProducts = prevState.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: updatedProduct.isFeatured } : product
				);

				let updatedFeaturedProducts;
				if (updatedProduct.isFeatured) {
					updatedFeaturedProducts = [...prevState.featuredProducts, updatedProduct];
				} else {
					updatedFeaturedProducts = prevState.featuredProducts.filter((product) => product._id !== productId);
				}

				return {
					products: updatedProducts,
					featuredProducts: updatedFeaturedProducts
				};
			});
		}
        catch (error) {
            handleError(error, "An error occurred", false);
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
		}
		catch (error) {
			handleError(error);
		}
		finally {
			set({ loading: false });
		}
	}
}));