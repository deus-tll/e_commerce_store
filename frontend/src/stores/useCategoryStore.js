import { create } from "zustand";
import axios from "../config/axios.js";
import { handleRequestError } from "../utils/errorHandler.js";

export const CATEGORIES_API_PATH = "/categories";

export const useCategoryStore = create((set) => ({
	categories: [],
	loading: false,

	fetchCategories: async () => {
		set({ loading: true });
		try {
			const res = await axios.get(CATEGORIES_API_PATH);
			set({ categories: res.data });
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