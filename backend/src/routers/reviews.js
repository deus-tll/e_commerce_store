import express from "express";

import { protectRoute } from "../middleware/authMiddleware.js";
import { ReviewController } from "../controllers/ReviewController.js";

const router = express.Router();
const reviewController = new ReviewController();

router.post("/product/:id", protectRoute, reviewController.addReview);
router.get("/product/:id", reviewController.getReviewsByProduct);
router.patch("/:reviewId", protectRoute, reviewController.updateReview);
router.delete("/:reviewId", protectRoute, reviewController.deleteReview);

export default router;