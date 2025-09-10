import { create } from "zustand";

import axios from "../config/axios.js";
import {handleRequestError} from "../utils/errorHandler.js";

export const PRODUCTS_API_PATH = "/products";

export const useProductStore = create((set, get) => ({
	products: [],
	featuredProducts: [],
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
			handleRequestError(error);
		}
		finally {
			set({ loading: false });
		}
	},

	fetchAllProducts: async () => {
		set({ loading: true });

		try {
			const res = await axios.get(PRODUCTS_API_PATH);
			set({ products: res.data });
		}
		catch (error) {
			handleRequestError(error);
		}
		finally {
			set({ loading: false });
		}
	},

	fetchProductsByCategory: async (category) => {
		set({ loading: true });

		try {
			const res = await axios.get(`${PRODUCTS_API_PATH}/category/${category}`);
			set({ products: res.data });
		}
		catch (error) {
			handleRequestError(error);
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
			handleRequestError(error);
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
			handleRequestError(error);
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
			handleRequestError(error);
		}
		finally {
			set({ loading: false });
		}
	}
}));