import {Router} from "express";

import {AuthController} from "../controllers/AuthController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {createProtectRoute} from "../middleware/auth.js";
import {validationMiddleware} from "../middleware/validation.js";

import {
	signupSchema,
	loginSchema,
	verifyEmailSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	changePasswordSchema
} from "../validators/auth.js";

export function setupAuthRouter(
	authController: AuthController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.get("/profile", protectRoute, authController.getProfile);

	router.post("/signup", validationMiddleware(signupSchema), authController.signup);
	router.post("/login", validationMiddleware(loginSchema), authController.login);
	router.post("/logout", authController.logout);
	router.post("/refresh-token", authController.refreshAccessToken);
	router.post("/verify-email", validationMiddleware(verifyEmailSchema), authController.verifyEmail);
	router.post("/forgot-password", validationMiddleware(forgotPasswordSchema), authController.forgotPassword);
	router.post("/reset-password/:token", validationMiddleware(resetPasswordSchema), authController.resetPassword);
	router.post("/resend-verification", protectRoute, authController.resendVerification);
	router.post("/change-password", protectRoute, validationMiddleware(changePasswordSchema), authController.changePassword);

	return router;
}