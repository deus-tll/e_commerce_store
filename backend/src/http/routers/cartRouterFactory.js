import express from "express";

import {CartController} from "../../controllers/CartController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	addProductSchema,
	removeProductSchema,
	updateProductQuantitySchema
} from "../validators/cartValidator.js";

/**
 * A factory that creates and configures the Cart router, injecting necessary dependencies.
 * @param {CartController} cartController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createCartRouter(cartController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);

	router.get("/", cartController.getCartItems);
	router.post("/", validationMiddleware(addProductSchema), cartController.addProduct);
	router.patch(
		"/:productId",
		validationMiddleware(updateProductQuantitySchema),
		cartController.updateProductQuantity
	);
	router.delete("/", cartController.clear);
	router.delete(
		"/:productId",
		validationMiddleware(removeProductSchema),
		cartController.removeProduct
	);

	return router;
}