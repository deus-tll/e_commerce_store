import {Router} from "express";

import {ReviewController} from "../controllers/ReviewController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {createProtectRoute} from "../middleware/auth.js";
import {validationMiddleware} from "../middleware/validation.js";

import {
	createReviewSchema,
	updateReviewSchema,
	deleteReviewSchema,
	getReviewsByProductSchema
} from "../validators/review.js";

export function setupReviewsRouter(
	reviewController: ReviewController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.get("/product/:id", validationMiddleware(getReviewsByProductSchema), reviewController.getByProduct);
	router.post("/product/:id", protectRoute, validationMiddleware(createReviewSchema), reviewController.create);
	router.patch("/:reviewId", protectRoute, validationMiddleware(updateReviewSchema), reviewController.update);
	router.delete("/:reviewId", protectRoute, validationMiddleware(deleteReviewSchema), reviewController.delete);

	return router;
}