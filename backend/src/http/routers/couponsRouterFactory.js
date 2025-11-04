import express from "express";

import {CouponController} from "../../controllers/CouponController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";

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
	router.post("/validate", couponController.validate);

	return router;
}