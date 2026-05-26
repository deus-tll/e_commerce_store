import {Router} from "express";

import {CategoryController} from "../controllers/CategoryController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	createCategorySchema,
	updateCategorySchema,
	categoryIdSchema,
	getAllCategoriesSchema, categorySlugSchema
} from "../validators/categoryValidator.js";

export function setupCategoriesRouter(
	categoryController: CategoryController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.get("/", validationMiddleware(getAllCategoriesSchema), categoryController.getAll);
	router.get("/slug/:slug", validationMiddleware(categorySlugSchema), categoryController.getBySlug);

	router.post("/", protectRoute, adminRoute, validationMiddleware(createCategorySchema), categoryController.create);

	router.patch("/:id", protectRoute, adminRoute, validationMiddleware(updateCategorySchema), categoryController.update);

	router.delete("/:id", protectRoute, adminRoute, validationMiddleware(categoryIdSchema), categoryController.delete);

	return router;
}