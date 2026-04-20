import api from "../config/axios.js";
import {makePathWithBase} from "../utils/paths.js";

const pathWithBase = makePathWithBase("/auth");

export const AuthPaths = Object.freeze({
	SIGNUP: "signup",
	LOGIN: "login",
	LOGOUT: "logout",
	PROFILE: "profile",
	REFRESH_TOKEN: "refresh-token",
	VERIFY_EMAIL: "verify-email",
	RESEND_VERIFICATION: "resend-verification",
	FORGOT_PASSWORD: "forgot-password",
	RESET_PASSWORD: "reset-password",
	CHANGE_PASSWORD: "change-password",
});

export const authApi = {
	signup: (data) => api.post(pathWithBase(AuthPaths.SIGNUP), data),
	login: (data) => api.post(pathWithBase(AuthPaths.LOGIN), data),
	logout: () => api.post(pathWithBase(AuthPaths.LOGOUT)),
	checkAuth: () => api.get(pathWithBase(AuthPaths.PROFILE)),
	refreshToken: () => api.post(pathWithBase(AuthPaths.REFRESH_TOKEN)),
	verifyEmail: (code) => api.post(pathWithBase(AuthPaths.VERIFY_EMAIL), { code }),
	resendVerification: () => api.post(pathWithBase(AuthPaths.RESEND_VERIFICATION)),
	forgotPassword: (email) => api.post(pathWithBase(AuthPaths.FORGOT_PASSWORD), { email }),
	resetPassword: (token, password) => api.post(pathWithBase(`${AuthPaths.RESET_PASSWORD}/${token}`), { password }),
	changePassword: (currentPassword, newPassword) => api.post(pathWithBase(AuthPaths.CHANGE_PASSWORD), { currentPassword, newPassword }),
};