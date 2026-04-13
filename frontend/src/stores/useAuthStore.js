import {create} from "zustand";

import axios from "../config/axios.js";
import {authApi, AuthPaths, NoRetryUrls} from "../api/authApi.js";

import {handleAsyncAction} from "../utils/storeHelpers.js";

const PUBLIC_PATHS = [
	"/", AuthPaths.SIGNUP, AuthPaths.LOGIN, AuthPaths.FORGOT_PASSWORD, AuthPaths.RESET_PASSWORD, AuthPaths.VERIFY_EMAIL
];

export const useAuthStore = create((set) => ({
	user: null,
	loading: false,
	checkingAuth: true,
	error: null,

	signup: async (data) => await handleAsyncAction(set, {
		action: () => authApi.signup(data),
		onSuccess: (res) => set({ user: res.data }),
		errorMessage: "Signup failed",
		shouldUpdateStoreError: true
	}),

	login: async (data) => await handleAsyncAction(set, {
		action: () => authApi.login(data),
		onSuccess: (res) => set({ user: res.data }),
		errorMessage: "Login failed",
		shouldUpdateStoreError: true
	}),

	logout: async () => await handleAsyncAction(set, {
		action: () => authApi.logout(),
		onSuccess: () => set({ user: null }),
		onError: () => set({ user: null }),
		errorMessage: "Logout attempt failed, proceeding with local logout."
	}),

	checkAuth: async () => await handleAsyncAction(set, {
		action: () => authApi.checkAuth(),
		onSuccess: (res) => set({ user: res.data }),
		onError: () => set({ user: null }),
		setLoading: (val) => set({ checkingAuth: val })
	}),

	refreshToken: async () => await handleAsyncAction(set, {
		action: () => authApi.refreshToken(),
		onError: () => set({ user: null }),
		errorMessage: "Session expired or invalid. Please log in again."
	}),

	verifyEmail: async (code) => await handleAsyncAction(set, {
		action: () => authApi.verifyEmail(code),
		onSuccess: (res) => set({ user: res.data }),
		errorMessage: "Verification failed",
		shouldUpdateStoreError: true
	}),

	resendVerification: async () => await handleAsyncAction(set, {
		action: () => authApi.resendVerification(),
		errorMessage: "Failed to resend verification code.",
		shouldUpdateStoreError: true
	}),

	forgotPassword: async (email) => await handleAsyncAction(set, {
		action: () => authApi.forgotPassword(email),
		errorMessage: "Failed to send reset link",
		shouldUpdateStoreError: true
	}),

	resetPassword: async (token, password) => await handleAsyncAction(set, {
		action: () => authApi.resetPassword(token, password),
		onSuccess: (res) => set({ user: res.data }),
		errorMessage: "Failed to reset password.",
		shouldUpdateStoreError: true
	}),

	changePassword: async (currentPassword, newPassword) => await handleAsyncAction(set, {
		action: () => authApi.changePassword(currentPassword, newPassword),
		onSuccess: () => set({ user: null }),
		errorMessage: "Failed to change password.",
		shouldUpdateStoreError: true
	}),

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
	if (NoRetryUrls.some(noRetryUrl => url.includes(noRetryUrl))) return false;

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