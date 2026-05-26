import {Router} from "express";

import {ProductController} from "../controllers/ProductController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/auth.js";
import {validationMiddleware} from "../middleware/validation.js";

import {
	createProductSchema,
	updateProductSchema,
	productIdSchema, getAllProductsPublicSchema
} from "../validators/product.js";

export function setupProductsRouter(
	productController: ProductController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.get("/categories/:id/facets", validationMiddleware(productIdSchema), productController.getFacets);
	router.get("/featured", productController.getFeatured);
	router.get("/recommended", protectRoute, productController.getRecommended);
	router.get("/", validationMiddleware(getAllProductsPublicSchema), productController.getAll);
	router.get("/:id", validationMiddleware(productIdSchema), productController.getById);

	router.post("/", protectRoute, adminRoute, validationMiddleware(createProductSchema), productController.create);

	router.patch("/:id/featured", protectRoute, adminRoute, validationMiddleware(productIdSchema), productController.toggleFeatured);
	router.patch("/:id", protectRoute, adminRoute, validationMiddleware(updateProductSchema), productController.update);

	router.delete("/:id", protectRoute, adminRoute, validationMiddleware(productIdSchema), productController.delete);

	return router;
}