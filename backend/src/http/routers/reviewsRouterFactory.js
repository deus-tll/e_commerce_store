import express from "express";

import {ReviewController} from "../../controllers/ReviewController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	createReviewSchema,
	updateReviewSchema,
	deleteReviewSchema,
	getReviewsByProductSchema
} from "../validators/reviewValidator.js";

/**
 * A factory that creates and configures the Reviews router, injecting necessary dependencies.
 * @param {ReviewController} reviewController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createReviewsRouter(reviewController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.post("/product/:id", protectRoute, validationMiddleware(createReviewSchema), reviewController.create);
	router.get("/product/:id", validationMiddleware(getReviewsByProductSchema), reviewController.getByProduct);
	router.patch("/:reviewId", protectRoute, validationMiddleware(updateReviewSchema), reviewController.update);
	router.delete("/:reviewId", protectRoute, validationMiddleware(deleteReviewSchema), reviewController.delete);

	return router;
}