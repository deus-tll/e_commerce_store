import express from "express";

import {AnalyticsController} from "../../controllers/AnalyticsController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";

/**
 * A factory that creates and configures the Analytics router, injecting necessary dependencies.
 * @param {AnalyticsController} analyticsController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createAnalyticsRouter(analyticsController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);
	router.use(adminRoute);

	router.get("/", analyticsController.getAnalytics);

	return router;
}