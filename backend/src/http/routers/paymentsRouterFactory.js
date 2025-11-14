import express from "express";

import {PaymentController} from "../../controllers/PaymentController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	createCheckoutSessionSchema,
	checkoutSuccessSchema
} from "../validators/paymentValidator.js";

/**
 * A factory that creates and configures the Payments router, injecting necessary dependencies.
 * @param {PaymentController} paymentController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createPaymentsRouter(paymentController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);

	router.post(
		"/create-checkout-session",
		validationMiddleware(createCheckoutSessionSchema),
		paymentController.createCheckoutSession
	);
	router.post(
		"/checkout-success",
		validationMiddleware(checkoutSuccessSchema),
		paymentController.checkoutSuccess
	);

	return router;
}