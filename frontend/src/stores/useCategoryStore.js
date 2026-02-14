import {create} from "zustand";

import axios from "../config/axios.js";

import {handleError} from "../utils/errorHandler.js";

import {ApiPaths} from "../constants/api.js";
import {PaginationLimits} from "../constants/app.js";
import toast from "react-hot-toast";

export const useCategoryStore = create((set, get) => ({
	categories: [],
	currentCategory: null,
	pagination: null,
	loading: false,
	error: null,

	fetchCategories: async (options = {}) => {
		const {
			page = 1,
			limit = PaginationLimits.CATEGORIES,
			append = true,
			filters = {}
		} = options;

		set({ loading: true });

		try {
			const params = new URLSearchParams({
				page: String(page),
				limit: String(limit),
				...filters
			});

			const requestPath = `${ApiPaths.CATEGORIES}?${params}`;

			const res = await axios.get(requestPath);

			const { categories: newCategories, pagination: newPagination } = res.data;

			set((prev) => ({
				categories: (append && page !== 1) ? [...prev.categories, ...newCategories] : newCategories,
				pagination: newPagination
			}));

			return true;
		}
		catch (error) {
			handleError(error, "Failed to load categories. Please refresh.", {
				isGlobal: true,
				showToast: false,
				forceUserMessage: true
			});

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	fetchCategoryBySlug: async (slug) => {
		set({ loading: true, error: null });

		try {
			const res = await axios.get(`${ApiPaths.CATEGORIES}/slug/${slug}`);
			set({ currentCategory: res.data });

			return true;
		} catch (error) {
			handleError(error, "Failed to load category details.", {
				isGlobal: true, showToast: false
			});
			set({ currentCategory: null });

			return false;
		} finally {
			set({ loading: false });
		}
	},

	createCategory: async ({ name, image, allowedAttributes }) => {
		set({ loading: true });
		try {
			await axios.post(ApiPaths.CATEGORIES, { name, image, allowedAttributes });
			await get().fetchCategories({ page: 1, append: false });

			toast.success("Category added successfully.");

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Category creation failed.", {
				isGlobal: false, showToast: false
			});

			set({ error: msg });
			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	updateCategory: async (id, { name, image, allowedAttributes }) => {
		set({ loading: true });

		const currentPage = get().pagination?.page || 1;

		try {
			await axios.patch(`${ApiPaths.CATEGORIES}/${id}`, { name, image, allowedAttributes });
			await get().fetchCategories({ page: currentPage, append: false });
			return true;
		}
		catch (error) {
			const msg = handleError(error, "Category update failed.", {
				isGlobal: false, showToast: false
			});

			set({ error: msg });
			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	deleteCategory: async (id) => {
		set({ loading: true });

		const state = get();
		const currentPage = state.pagination?.page || 1;
		const limit = state.pagination?.limit || PaginationLimits.CATEGORIES;
		const oldTotal = state.pagination?.totalPrice || 0;

		try {
			await axios.delete(`${ApiPaths.CATEGORIES}/${id}`);

			const newTotal = oldTotal > 0 ? oldTotal - 1 : 0;
			const maxPage = Math.ceil(newTotal / limit) || 1;
			const pageToFetch = currentPage > maxPage ? maxPage : currentPage;

			await get().fetchCategories({ page: pageToFetch, append: false });

			return true;
		}
		catch (error) {
			handleError(error, "Category deletion failed.", {
				isGlobal: true, showToast: false
			});

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	clearCurrentCategory: () => set({ currentCategory: null }),
	clearError: () => set({ error: null })
}));