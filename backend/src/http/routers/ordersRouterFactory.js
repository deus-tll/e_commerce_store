import express from "express";
import { adminRoute, createProtectRoute } from "../middleware/authMiddleware.js";
import { validationMiddleware } from "../middleware/validationMiddleware.js";
import {
	getAllOrdersSchema,
	getMineOrdersSchema,
	updateOrderStatusSchema,
	orderIdSchema,
	orderNumberSchema,
	paymentSessionIdSchema
} from "../validators/orderValidator.js";

/**
 * @param {OrderController} orderController
 * @param {ISessionAuthService} authService
 */
export function createOrdersRouter(orderController, authService) {
	const router = express.Router();
	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);

	// Customer Routes
	router.get("/mine",
		validationMiddleware(getMineOrdersSchema),
		orderController.getAllMine
	);

	// Admin Routes
	router.get("/number/:orderNumber",
		adminRoute,
		validationMiddleware(orderNumberSchema),
		orderController.getByOrderNumber
	);

	router.get("/payment-session/:sessionId",
		adminRoute,
		validationMiddleware(paymentSessionIdSchema),
		orderController.getByPaymentId
	);

	router.get("/",
		adminRoute,
		validationMiddleware(getAllOrdersSchema),
		orderController.getAll
	);

	router.get("/:id",
		validationMiddleware(orderIdSchema),
		orderController.getById
	);

	router.patch("/:id/status",
		adminRoute,
		validationMiddleware(updateOrderStatusSchema),
		orderController.updateStatus
	);
}