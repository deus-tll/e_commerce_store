import express from "express";

import {CouponController} from "../../controllers/CouponController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import { validateCouponSchema } from "../validators/couponValidator.js";

/**
 * A factory that creates and configures the Coupons router, injecting necessary dependencies.
 * @param {CouponController} couponController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createCouponsRouter(couponController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);

	router.get("/", couponController.get);
	router.post(
		"/validate",
		validationMiddleware(validateCouponSchema),
		couponController.validate
	);

	return router;
}