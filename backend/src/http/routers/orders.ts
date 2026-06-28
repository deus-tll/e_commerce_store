import {Router} from "express";

import {OrderController} from "../controllers/OrderController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/auth.js";
import {validationMiddleware} from "../middleware/validation.js";

import {
	getAllOrdersSchema,
	getMineOrdersSchema,
	updateOrderStatusSchema,
	orderIdSchema,
	orderNumberSchema,
	paymentSessionIdSchema
} from "../validators/order.js";

export function setupOrdersRouter(
	orderController: OrderController,
	authService: SessionAuthService
): Router {
	const router = Router();
	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);

	router.get("/mine", validationMiddleware(getMineOrdersSchema), orderController.getAllMine);
	router.get("/number/:orderNumber", adminRoute, validationMiddleware(orderNumberSchema), orderController.getByOrderNumber);
	router.get("/payment-status/:sessionId", validationMiddleware(paymentSessionIdSchema), orderController.getPaymentStatus);
	router.get("/payment-session/:sessionId", adminRoute, validationMiddleware(paymentSessionIdSchema), orderController.getByPaymentSessionId);
	router.get("/", adminRoute, validationMiddleware(getAllOrdersSchema), orderController.getAll);
	router.get("/:id", validationMiddleware(orderIdSchema), orderController.getById);

	router.patch("/:id/status", adminRoute, validationMiddleware(updateOrderStatusSchema), orderController.updateStatus);

	return router;
}