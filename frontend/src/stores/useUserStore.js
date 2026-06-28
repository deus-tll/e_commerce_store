import {create} from "zustand";

import userApi from "../api/userApi.js";

import {PAGINATION_LIMITS} from "../constants/app.js";
import {USER_ROLE_VALUES} from "../constants/domain.js";

import {
	getInitialPagination,
	handleAsyncAction,
	handlePaginatedFetch, handleSetPage,
	handleUpdateFilter, handleClearFilters,
	handleDeletionNavigation
} from "../utils/storeHelpers.js";

export const UserFilterKeys = Object.freeze({
	SEARCH: "search",
	ROLE: "role",
	IS_VERIFIED: "isVerified",
});

const INITIAL_USER_FILTERS = Object.freeze({
	search: "",
	role: "",
	isVerified: ""
});

export const useUserStore = create((set, get) => ({
	users: [],
	pagination: getInitialPagination(PAGINATION_LIMITS.USERS),
	filters: INITIAL_USER_FILTERS,
	loading: false,
	error: null,
	stats: null,

	fetchUsers: async () => await handlePaginatedFetch(
		set, get,
		userApi.getAll,
		(data) => set({ users: data.users, pagination: data.pagination }),
		"Failed to load users. Please refresh."
	),
	setPage: async (newPage = 1) => await handleSetPage(set, get, newPage, get().fetchUsers),

	fetchStats: async () => await handleAsyncAction(set, {
		action: () => userApi.getStats(),
		onSuccess: (res) => set({ stats: res.data }),
		errorMessage: "Failed to fetch user statistics.",
		shouldUpdateStoreError: false,
		handleErrorOptions: { showToast: true }
	}),

	createUser: async (userData) => await handleAsyncAction(set, {
		action: () => userApi.create(userData),
		onSuccess: () => get().setPage(1),
		errorMessage: "User creation failed.",
		shouldUpdateStoreError: true
	}),

	updateUser: async (id, userData) => await handleAsyncAction(set, {
		action: () => userApi.update(id, userData),
		onSuccess: () => get().fetchUsers(),
		errorMessage: "User update failed.",
		shouldUpdateStoreError: true
	}),

	deleteUser: async (id) => await handleAsyncAction(set, {
		action: () => userApi.delete(id),
		onSuccess: () => handleDeletionNavigation(get, get().setPage, get().fetchUsers),
		errorMessage: "User deletion failed.",
		shouldUpdateStoreError: false,
		handleErrorOptions: { isGlobal: true }
	}),

	updateFilter: async (key, value) => {
		if(key === UserFilterKeys.ROLE && value !== "" && !USER_ROLE_VALUES.includes(value)) {
			set({ error: "Invalid role selected." });
			return;
		}

		await handleUpdateFilter(set, get().fetchUsers, key, value);
	},
	clearFilters: () => handleClearFilters(
		set, get().fetchUsers, INITIAL_USER_FILTERS, false, { limit: PAGINATION_LIMITS.USERS }
	),
	clearFiltersAndFetch: async () => await handleClearFilters(
		set, get().fetchUsers, INITIAL_USER_FILTERS, true, { limit: PAGINATION_LIMITS.USERS }
	),

	clearError: () => set({ error: null })
}));