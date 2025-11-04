import express from "express";

import {ReviewController} from "../../controllers/ReviewController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";

/**
 * A factory that creates and configures the Reviews router, injecting necessary dependencies.
 * @param {ReviewController} reviewController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createReviewsRouter(reviewController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.post("/product/:id", protectRoute, reviewController.create);
	router.get("/product/:id", reviewController.getByProduct);
	router.put("/:reviewId", protectRoute, reviewController.update);
	router.delete("/:reviewId", protectRoute, reviewController.delete);

	return router;
}