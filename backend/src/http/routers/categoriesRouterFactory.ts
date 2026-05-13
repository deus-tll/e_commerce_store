import { Router } from "express";

import {CategoryController} from "../../controllers/CategoryController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	createCategorySchema,
	updateCategorySchema,
	categoryIdSchema,
	getAllCategoriesSchema, categorySlugSchema
} from "../validators/categoryValidator.js";

/**
 * A factory that creates and configures the Categories router.
 */
export function createCategoriesRouter(
	categoryController: CategoryController,
	authService: ISessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.get("/", validationMiddleware(getAllCategoriesSchema), categoryController.getAll);
	router.post("/", protectRoute, adminRoute, validationMiddleware(createCategorySchema), categoryController.create);
	router.get("/slug/:slug", validationMiddleware(categorySlugSchema), categoryController.getBySlug);
	router.patch("/:id", protectRoute, adminRoute, validationMiddleware(updateCategorySchema), categoryController.update);
	router.delete("/:id", protectRoute, adminRoute, validationMiddleware(categoryIdSchema), categoryController.delete);

	return router;
}