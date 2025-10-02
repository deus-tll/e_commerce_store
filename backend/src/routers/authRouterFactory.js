import express from "express";
import { createProtectRoute } from "../middleware/authMiddleware.js";

/**
 * @typedef {import('../interfaces/IAuthService.js').IAuthService} IAuthService
 * @typedef {import('../controllers/AuthController.js').AuthController} AuthController
 */

/**
 * A factory that creates and configures an authentication router.
 * @param {AuthController} authController
 * @param {IAuthService} authService - Required to create protectRoute.
 * @returns {core.Router}
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