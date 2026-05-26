import {Router} from "express";

import {PaymentController} from "../controllers/PaymentController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	createCheckoutSessionSchema
} from "../validators/paymentValidator.js";

export function setupPaymentRouter(
	paymentController: PaymentController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);

	router.post(
		"/create-checkout-session",
		validationMiddleware(createCheckoutSessionSchema),
		paymentController.checkout
	);

	return router;
}