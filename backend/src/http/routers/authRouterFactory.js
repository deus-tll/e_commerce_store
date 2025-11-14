import express from "express";

import {AuthController} from "../../controllers/AuthController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	signupSchema,
	loginSchema,
	verifyEmailSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	changePasswordSchema
} from "../validators/authValidator.js";

/**
 * A factory that creates and configures the Auth router, injecting necessary dependencies.
 * @param {AuthController} authController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createAuthRouter(authController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.post("/signup", validationMiddleware(signupSchema), authController.signup);
	router.post("/login", validationMiddleware(loginSchema), authController.login);
	router.post("/logout", authController.logout);
	router.post("/refresh-token", authController.refreshAccessToken);
	router.post("/verify-email", validationMiddleware(verifyEmailSchema), authController.verifyEmail);
	router.post("/forgot-password", validationMiddleware(forgotPasswordSchema), authController.forgotPassword);
	router.post("/reset-password/:token", validationMiddleware(resetPasswordSchema), authController.resetPassword);

	router.get("/profile", protectRoute, authController.getProfile);
	router.post("/resend-verification", protectRoute, authController.resendVerification);
	router.post("/change-password", protectRoute, validationMiddleware(changePasswordSchema), authController.changePassword);

	return router;
}