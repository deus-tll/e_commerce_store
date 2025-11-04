import express from "express";

import {CartController} from "../../controllers/CartController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";

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
	router.post("/", cartController.addProduct);
	router.delete("/:productId", cartController.removeProduct);
	router.delete("/", cartController.clear);
	router.put("/:productId", cartController.updateProductQuantity);

	return router;
}