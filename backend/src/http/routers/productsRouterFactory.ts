import {Router} from "express";

import {ProductController} from "../controllers/ProductController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	createProductSchema,
	updateProductSchema,
	productIdSchema, getAllProductsPublicSchema
} from "../validators/productValidator.js";

export function createProductsRouter(
	productController: ProductController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	// GET
	router.get("/categories/:id/facets",
		validationMiddleware(productIdSchema),
		productController.getFacets
	);
	router.get("/featured", productController.getFeatured);
	router.get("/recommended", protectRoute, productController.getRecommended);
	router.get("/",
		validationMiddleware(getAllProductsPublicSchema),
		productController.getAll
	);
	router.get("/:id", validationMiddleware(productIdSchema), productController.getById);

	// POST
	router.post("/",
		protectRoute,
		adminRoute,
		validationMiddleware(createProductSchema),
		productController.create
	);

	// PATCH
	router.patch("/:id/featured",
		protectRoute,
		adminRoute,
		validationMiddleware(productIdSchema),
		productController.toggleFeatured
	);
	router.patch("/:id",
		protectRoute,
		adminRoute,
		validationMiddleware(updateProductSchema),
		productController.update
	);

	// DELETE
	router.delete("/:id",
		protectRoute,
		adminRoute,
		validationMiddleware(productIdSchema),
		productController.delete
	);

	return router;
}