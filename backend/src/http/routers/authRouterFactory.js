import express from "express";

import {AuthController} from "../../controllers/AuthController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";

/**
 * A factory that creates and configures the Auth router, injecting necessary dependencies.
 * @param {AuthController} authController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createAuthRouter(authController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.post("/signup", authController.signup);
	router.post("/login", authController.login);
	router.post("/logout", authController.logout);
	router.post("/refresh-token", authController.refreshAccessToken);
	router.post("/verify-email", authController.verifyEmail);
	router.post("/forgot-password", authController.forgotPassword);
	router.post("/reset-password/:token", authController.resetPassword);

	router.get("/profile", protectRoute, authController.getProfile);
	router.post("/resend-verification", protectRoute, authController.resendVerification);
	router.put("/change-password", protectRoute, authController.changePassword);

	return router;
}