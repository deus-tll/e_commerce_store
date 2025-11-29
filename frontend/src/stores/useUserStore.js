import { create } from "zustand";

import axios from "../config/axios.js";
import {handleError} from "../utils/errorHandler.js";

const USERS_API_PATH = "/users";

export const useUserStore = create((set, get) => ({
	users: [],
	stats: null,
	pagination: null,
	loading: false,
	error: null,

	fetchUsers: async (page = 1, limit = 10, filters = {}) => {
		set({ loading: true, error: null });

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
		}
		catch (error) {
			set({ error: error.message });
			handleError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	fetchStats: async () => {
		try {
			const res = await axios.get(`${USERS_API_PATH}/stats`);
			set({ stats: res.data });
		}
		catch (error) {
			handleError(error);
			throw error;
		}
	},

	createUser: async (userData) => {
		set({ loading: true, error: null });

		try {
			const res = await axios.post(USERS_API_PATH, userData);

			await get().fetchUsers();

			return res.data;
		}
		catch (error) {
			set({ error: error.message });
			handleError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	updateUser: async (userId, userData) => {
		set({ loading: true, error: null });

		try {
			const res = await axios.put(`${USERS_API_PATH}/${userId}`, userData);

			await get().fetchUsers();

			return res.data;
		}
		catch (error) {
			set({ error: error.message });
			handleError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	deleteUser: async (userId) => {
		set({ loading: true, error: null });

		try {
			await axios.delete(`${USERS_API_PATH}/${userId}`);

			await get().fetchUsers();
		}
		catch (error) {
			set({ error: error.message });
			handleError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	clearError: () => {
		set({ error: null });
	}
}));