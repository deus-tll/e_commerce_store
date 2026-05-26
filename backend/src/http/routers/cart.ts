import {Router} from "express";

import {CartController} from "../controllers/CartController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {createProtectRoute} from "../middleware/auth.js";
import {validationMiddleware} from "../middleware/validation.js";

import {
	addProductSchema,
	removeProductSchema,
	updateProductQuantitySchema
} from "../validators/cart.js";

export function setupCartRouter(
	cartController: CartController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);

	router.get("/", cartController.getCartItems);

	router.post("/", validationMiddleware(addProductSchema), cartController.addProduct);

	router.patch("/:productId", validationMiddleware(updateProductQuantitySchema), cartController.updateProductQuantity);

	router.delete("/", cartController.clear);
	router.delete("/:productId", validationMiddleware(removeProductSchema), cartController.removeProduct);

	return router;
}