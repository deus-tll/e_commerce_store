import {create} from "zustand";

import axios from "../config/axios.js";
import {handleError} from "../utils/errorHandler.js";

const AUTH_API_PATH = "/auth";

const NO_RETRY_URLS = [
	`${AUTH_API_PATH}/login`,
	`${AUTH_API_PATH}/signup`,
	`${AUTH_API_PATH}/forgot-password`,
	`${AUTH_API_PATH}/refresh-token`,
	`${AUTH_API_PATH}/verify-email`,
	`${AUTH_API_PATH}/reset-password`
];
const PUBLIC_PATHS = [
	"/", "/signup", "/login", "/forgot-password", "/reset-password", "/verify-email"
];

export const useAuthStore = create((set) => ({
	user: null,
	loading: false,
	checkingAuth: true,
	error: null,

	signup: async ({ name, email, password }) => {
		set({ loading: true, error: null });

		try {
			const res = await axios.post(`${AUTH_API_PATH}/signup`, { name, email, password });
			set({ user: res.data });

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Signup failed", {
				isGlobal: false, showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	login: async ({ email, password }) => {
		set({ loading: true, error: null });

		try {
			const res = await axios.post(`${AUTH_API_PATH}/login`, { email, password });
			set({ user: res.data });

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Login failed", {
				isGlobal: false, showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	logout: async () => {
		try {
			await axios.post(`${AUTH_API_PATH}/logout`);
			set({ user: null });

			return true;
		}
		catch (error) {
			handleError(error, "Logout attempt failed, proceeding with local logout.", {
				isGlobal: false, showToast: false
			});

			return false;
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

			return true;
		}
		// eslint-disable-next-line no-unused-vars
		catch (error) {
			set({ user: null });
			return false;
		}
		finally {
			set({ checkingAuth: false });
		}
	},

	refreshToken: async () => {
		try {
			await axios.post(`${AUTH_API_PATH}/refresh-token`);
			return true;
		}
		catch (error) {
			handleError(error, "Session expired or invalid. Please log in again.", {
				isGlobal: true, showToast: false
			});
			set({ user: null });

			return false;
		}
	},

	verifyEmail: async (code) => {
		set({ loading: true, error: null });

		try {
			const res = await axios.post(`${AUTH_API_PATH}/verify-email`, { code });
			set({ user: res.data });

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Verification failed", {
				isGlobal: false, showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	resendVerification: async () => {
		set({ loading: true, error: null });

		try {
			await axios.post(`${AUTH_API_PATH}/resend-verification`);
			return true;
		}
		catch (error) {
			const msg = handleError(error, "Failed to resend verification code.", {
				isGlobal: false, showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	forgotPassword: async (email) => {
		set({ loading: true, error: null });

		try {
			await axios.post(`${AUTH_API_PATH}/forgot-password`, { email });
			return true;
		}
		catch (error) {
			const msg = handleError(error, "Failed to send reset link", {
				isGlobal: false, showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	resetPassword: async ({token, password}) => {
		set({ loading: true, error: null });

		try {
			const res = await axios.post(`${AUTH_API_PATH}/reset-password/${token}`, { password });
			set({ user: res.data });

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Password reset failed", {
				isGlobal: false, showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	changePassword: async ({ currentPassword, newPassword }) => {
		set({ loading: true, error: null });

		try {
			await axios.post(`${AUTH_API_PATH}/change-password`, {
				currentPassword,
				newPassword
			});

			set({ user: null });

			return true;
		}
		catch (error) {
			const msg = handleError(error, "Failed to change password.", {
				isGlobal: false, showToast: false
			});
			set({ error: msg });

			return false;
		}
		finally {
			set({ loading: false });
		}
	},

	clearError: () => set({ error: null })
}));

// --- GLOBAL INTERCEPTOR STATE ---
let isRefreshing = false;
let failedQueue = [];

// --- HELPER FUNCTIONS ---

/**
 * 1. Checks if the error indicates a recoverable token failure.
 * @param {object} error - The Axios error object.
 * @param {object} originalRequest - The Axios infrastructure object for the failed request.
 * @returns {boolean} True if a token refresh should be attempted.
 */
function canRetryRequest(error, originalRequest) {
	if (error.response?.status !== 401) return false;

	if (originalRequest._retry) return false;

	const url = originalRequest.url || "";
	if (NO_RETRY_URLS.some(noRetryUrl => url.includes(noRetryUrl))) return false;

	const errorCode = error.response?.data?.code;

	return errorCode === "TOKEN_EXPIRED" || errorCode === "INVALID_TOKEN";
}

/**
 * 2. Processes the queue, resolving or rejecting all waiting requests.
 * @param {object|null} error - The error object if the refresh failed.
 */
const processQueue = (error) => {
	failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve());
	failedQueue = [];
};

/**
 * 3. Queues the request to wait for the ongoing refresh operation to complete.
 * @param {object} originalRequest - The Axios infrastructure object for the failed request.
 * @returns {Promise<object>} A promise that resolves with the successful response of the retried request.
 */
function queueFailedRequest(originalRequest) {
	return new Promise((resolve, reject) => {
		failedQueue.push({resolve, reject});
	})
		.then(() => {
			// Once resolved, re-run the request
			return axios(originalRequest);
		})
		.catch(err => {
			// If refresh failed, propagate the failure
			return Promise.reject(err);
		});
}

/**
 * 4. Executes the token refresh, retries the initiating request, and handles cleanup.
 * @param {object} originalRequest - The Axios infrastructure object for the failed request.
 * @returns {Promise<object>} A promise that resolves with the successful response of the retried request.
 */
async function handleTokenRefresh(originalRequest) {
	isRefreshing = true;

	try {
		// Call the refresh logic from the store
		const success = await useAuthStore.getState().refreshToken();
		if (!success) throw new Error("Refresh failed");

		// Refresh succeeded. Resolve all queued requests
		processQueue(null);

		// Re-run the original failed request
		return axios(originalRequest);
	}
	catch (refreshError) {
		// Refresh failed. Reject all queued requests
		processQueue(refreshError);

		// If refresh failed, handle the critical logout/redirect
		if (typeof window !== 'undefined') {
			const currentPath = window.location.pathname;

			if (!PUBLIC_PATHS.includes(currentPath)) {
				window.location.href = '/login';
			}
		}

		// Propagate the refresh failure
		return Promise.reject(refreshError);
	}
	finally {
		isRefreshing = false;
	}
}

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// 1. Check if we need to refresh
		if (!canRetryRequest(error, originalRequest)) {
			return Promise.reject(error);
		}

		// Mark as retried before queuing or refreshing
		originalRequest._retry = true;

		// 2. Concurrency Check (Queue)
		if (isRefreshing) {
			return queueFailedRequest(originalRequest);
		}

		// 2. Start Refresh Process
		return handleTokenRefresh(originalRequest);
	}
);