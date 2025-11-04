import express from "express";

import {CategoryController} from "../../controllers/CategoryController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";

/**
 * A factory that creates and configures the Categories router, injecting necessary dependencies.
 * @param {CategoryController} categoryController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createCategoriesRouter(categoryController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.get("/", categoryController.getAll);
	router.post("/", protectRoute, adminRoute, categoryController.create);
	router.put("/:id", protectRoute, adminRoute, categoryController.update);
	router.delete("/:id", protectRoute, adminRoute, categoryController.delete);

	return router;
}