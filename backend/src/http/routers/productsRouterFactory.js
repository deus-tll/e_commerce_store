import express from "express";

import {ProductController} from "../../controllers/ProductController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";

/**
 * A factory that creates and configures the Products router, injecting necessary dependencies.
 * @param {ProductController} productController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createProductsRouter(productController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.get("/", protectRoute, adminRoute, productController.getAll);
	router.get("/featured", productController.getFeatured);
	router.get("/recommended", productController.getRecommended);
	router.get("/:id", productController.getById);
	router.post("/", protectRoute, adminRoute, productController.create);
	router.put("/:id", protectRoute, adminRoute, productController.update);
	router.patch("/:id", protectRoute, adminRoute, productController.toggleFeatured);
	router.delete("/:id", protectRoute, adminRoute, productController.delete);

	return router;
}