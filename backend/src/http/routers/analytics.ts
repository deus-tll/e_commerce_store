import {Router} from "express";

import {AnalyticsController} from "../controllers/AnalyticsController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";

export function setupAnalyticsRouter(
	analyticsController: AnalyticsController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);
	router.use(adminRoute);

	router.get("/", analyticsController.getAnalytics);

	return router;
}