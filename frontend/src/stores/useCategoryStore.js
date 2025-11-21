import { create } from "zustand";
import axios from "../config/axios.js";
import { handleRequestError } from "../utils/errorHandler.js";

export const CATEGORIES_API_PATH = "/categories";
export const DEFAULT_LIMIT = 12;

export const useCategoryStore = create((set) => ({
	categories: [],
	pagination: null,
	loading: false,

	fetchCategories: async (page = 1, limit = DEFAULT_LIMIT) => {
		set({ loading: true });
		try {
			const params = new URLSearchParams({ page: String(page), limit: String(limit) });
			const requestPath = `${CATEGORIES_API_PATH}?${params}`;

			const res = await axios.get(requestPath);

			const { categories: newCategories, pagination: newPagination } = res.data;

			set((prev) => ({
				categories: page === 1 ? newCategories : [...prev.categories, ...newCategories],
				pagination: newPagination
			}));
		}
		catch (error) {
			handleRequestError(error, "Error fetching categories");
		}
		finally {
			set({ loading: false });
		}
	},

	createCategory: async ({ name, image }) => {
		set({ loading: true });
		try {
			const res = await axios.post(CATEGORIES_API_PATH, { name, image });
			set((prev) => ({ categories: [ ...prev.categories, res.data ] }));
		}
		catch (error) {
			handleRequestError(error, "Error creating category");
		}
		finally {
			set({ loading: false });
		}
	},

	updateCategory: async (id, { name, image }) => {
		set({ loading: true });
		try {
			const res = await axios.put(`${CATEGORIES_API_PATH}/${id}`, { name, image });
			set((prev) => ({
				categories: prev.categories.map((category) => (category._id === id ? res.data : category))
			}));
		}
		catch (error) {
			handleRequestError(error, "Error updating category");
		}
		finally {
			set({ loading: false });
		}
	},

	deleteCategory: async (id) => {
		set({ loading: true });
		try {
			await axios.delete(`${CATEGORIES_API_PATH}/${id}`);
			set((prev) => ({ categories: prev.categories.filter((category) => category._id !== id) }));
		}
		catch (error) {
			handleRequestError(error, "Error deleting category");
		}
		finally {
			set({ loading: false });
		}
	}
}));