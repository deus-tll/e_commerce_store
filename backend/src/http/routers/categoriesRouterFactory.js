import express from "express";

import {CategoryController} from "../../controllers/CategoryController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	createCategorySchema,
	updateCategorySchema,
	categoryIdSchema,
	getAllCategoriesSchema
} from "../validators/categoryValidator.js";

/**
 * A factory that creates and configures the Categories router, injecting necessary dependencies.
 * @param {CategoryController} categoryController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createCategoriesRouter(categoryController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.get("/", validationMiddleware(getAllCategoriesSchema), categoryController.getAll);
	router.post("/", protectRoute, adminRoute, validationMiddleware(createCategorySchema), categoryController.create);
	router.patch("/:id", protectRoute, adminRoute, validationMiddleware(updateCategorySchema), categoryController.update);
	router.delete("/:id", protectRoute, adminRoute, validationMiddleware(categoryIdSchema), categoryController.delete);

	return router;
}