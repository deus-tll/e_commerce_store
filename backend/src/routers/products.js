import express from "express";

import {
	getProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	createProduct,
	toggleFeaturedProduct,
	deleteProduct,
} from "../controllers/products.js";
import {adminRoute, protectRoute} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;