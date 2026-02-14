import { create } from "zustand";

import axios from "../config/axios.js";

import {handleError} from "../utils/errorHandler.js";

import {PaginationLimits} from "../constants/app.js";

const USERS_API_PATH = "/users";

export const useUserStore = create((set, get) => ({
	users: [],
	pagination: null,
	stats: null,
	loading: false,
	error: null,

	fetchUsers: async (options = {}) => {
		const {
			page = 1,
			limit = PaginationLimits.USERS,
			filters = {}
		} = options;

		set({ loading: true });

		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				...filters
			});

			const res = await axios.get(`${USERS_API_PATH}?${params}`);

			set({ 
				users: res.data.users,
				pagination: res.data.pagination
			});

			return true;
		}
		catch (error) {
			handleError(error, "Failed to load users. Please refresh.", {
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

	fetchStats: async () => {
		try {
			const res = await axios.get(`${USERS_API_PATH}/stats`);
			set({ stats: res.data });

			return true;
		}
		catch (error) {
			handleError(error, "Failed to fetch user statistics.");
			return false;
		}
	},

	createUser: async (userData) => {
		set({ loading: true, error: null });

		try {
			await axios.post(USERS_API_PATH, userData);

			await get().fetchUsers({ page: 1 });

			return true;
		}
		catch (error) {
			const msg = handleError(error, "User creation failed.", {
				isGlobal: false,
				showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	updateUser: async (userId, userData) => {
		set({ loading: true, error: null });

		const currentPage = get().pagination?.page || 1;

		try {
			await axios.patch(`${USERS_API_PATH}/${userId}`, userData);
			await get().fetchUsers({ page: currentPage });

			return true;
		}
		catch (error) {
			const msg = handleError(error, "User update failed.", {
				isGlobal: false,
				showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	deleteUser: async (userId) => {
		set({ loading: true, error: null });

		const state = get();
		const currentPage = state.pagination?.page || 1;
		const limit = state.pagination?.limit || PaginationLimits.USERS;
		const oldTotal = state.pagination?.totalPrice || 0;

		try {
			await axios.delete(`${USERS_API_PATH}/${userId}`);

			const newTotal = oldTotal > 0 ? oldTotal - 1 : 0;
			const maxPage = Math.ceil(newTotal / limit) || 1;
			const pageToFetch = currentPage > maxPage ? maxPage : currentPage;

			await get().fetchUsers({ page: pageToFetch });

			return true;
		}
		catch (error) {
			handleError(error, "User deletion failed.", {
				isGlobal: true,
				showToast: false
			});

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	clearError: () => set({ error: null })
}));