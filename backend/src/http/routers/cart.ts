import {Router} from "express";

import {CartController} from "../controllers/CartController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {createProtectRoute} from "../middleware/auth.js";
import {validationMiddleware} from "../middleware/validation.js";

import {
	addItemSchema,
	removeItemSchema,
	updateItemQuantitySchema
} from "../validators/cart.js";

export function setupCartRouter(
	cartController: CartController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);

	router.get("/", cartController.getItems);

	router.post("/", validationMiddleware(addItemSchema), cartController.addItem);

	router.patch("/:productId", validationMiddleware(updateItemQuantitySchema), cartController.updateItemQuantity);

	router.delete("/", cartController.clear);
	router.delete("/:productId", validationMiddleware(removeItemSchema), cartController.removeItem);

	return router;
}