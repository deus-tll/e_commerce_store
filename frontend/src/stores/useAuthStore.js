import { create } from "zustand";

import axios from "../config/axios.js";
import {handleRequestError} from "../utils/errorHandler.js";

const AUTH_API_PATH = "/auth";

const NO_RETRY_URLS = [
	`${AUTH_API_PATH}/login`,
	`${AUTH_API_PATH}/signup`,
	`${AUTH_API_PATH}/forgot-password`,
	`${AUTH_API_PATH}/refresh-token`,
	`${AUTH_API_PATH}/verify-email`,
	`${AUTH_API_PATH}/reset-password`
];

export const useAuthStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		try {
			if (password !== confirmPassword) {
				set({ loading: false });
				throw new Error("Passwords don't match");
			}

			const res = await axios.post(`${AUTH_API_PATH}/signup`, { name, email, password });
			set({ user: res.data });
		}
		catch (error) {
			handleRequestError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	login: async ({ email, password }) => {
		set({ loading: true });

		try {
			const res = await axios.post(`${AUTH_API_PATH}/login`, { email, password });
			set({ user: res.data });
		}
		catch (error) {
			handleRequestError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	logout: async () => {
		try {
			await axios.post(`${AUTH_API_PATH}/logout`);
			set({ user: null });
		}
		catch (error) {
			handleRequestError(error, "", false);
		}
		finally {
			set({ user: null });
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });

		try {
			const res = await axios.get(`${AUTH_API_PATH}/profile`);
			set({ user: res.data });
		}
		catch (error) {
			set({ user: null });
			console.debug("Auth check failed:", error.message);
		}
		finally {
			set({ checkingAuth: false });
		}
	},

	refreshToken: async () => {
		if (get().checkingAuth) return;

		set({ checkingAuth: true });

		try {
			const res = await axios.post(`${AUTH_API_PATH}/refresh-token`);
			return res.data;
		}
		catch (error) {
			set({ user: null });
			throw error;
		}
		finally {
			set({ checkingAuth: false });
		}
	},

	verifyEmail: async (code) => {
		set({ loading: true });

		try {
			const res = await axios.post(`${AUTH_API_PATH}/verify-email`, { code });
			set({ user: res.data });
		}
		catch (error) {
			handleRequestError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	resendVerification: async () => {
		set({ loading: true });

		try {
			await axios.post(`${AUTH_API_PATH}/resend-verification`);
		}
		catch (error) {
			handleRequestError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	forgotPassword: async (email) => {
		set({ loading: true });

		try {
			await axios.post(`${AUTH_API_PATH}/forgot-password`, { email });
		}
		catch (error) {
			handleRequestError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	resetPassword: async ({token, password, confirmPassword}) => {
		set({ loading: true });

		try {
			if (password !== confirmPassword) {
				set({ loading: false });
				throw new Error("Passwords don't match");
			}

			const res = await axios.post(`${AUTH_API_PATH}/reset-password/${token}`, { password });
			set({ user: res.data });
		}
		catch (error) {
			handleRequestError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	},

	changePassword: async ({ currentPassword, newPassword, confirmPassword }) => {
		set({ loading: true });

		try {
			if (newPassword !== confirmPassword) {
				set({ loading: false });
				throw new Error("New passwords don't match");
			}

			await axios.post(`${AUTH_API_PATH}/change-password`, {
				currentPassword,
				newPassword
			});

			set({ user: null });
		}
		catch (error) {
			handleRequestError(error);
			throw error;
		}
		finally {
			set({ loading: false });
		}
	}
}));

let refreshPromise = null;

function canRetryRequest(error, originalRequest) {
	if (error.response?.status !== 401) return false;

	if (originalRequest._retry) return false;

	const url = originalRequest.url || '';
	if (NO_RETRY_URLS.some(noRetryUrl => url.includes(noRetryUrl))) return false;

	const errorCode = error.response?.data?.code;

	return errorCode === 'TOKEN_EXPIRED';
}

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (!canRetryRequest(error, originalRequest)) {
			return Promise.reject(error);
		}

		originalRequest._retry = true;

		try {
			if (refreshPromise) {
				await refreshPromise;
				return axios(originalRequest);
			}

			refreshPromise = useAuthStore.getState().refreshToken();
			await refreshPromise;
			refreshPromise = null;

			return axios(originalRequest);
		}
		catch (refreshError) {
			refreshPromise = null;

			await useAuthStore.getState().logout();

			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				const publicPaths = ["/login", "/signup", "verify-email", "/forgot-password", "/reset-password"];
				const isHomePage = currentPath === '/';

				if (!publicPaths.includes(currentPath) && !isHomePage) {
					window.location.href = '/login';
				}
			}

			return Promise.reject(refreshError);
		}
	}
);