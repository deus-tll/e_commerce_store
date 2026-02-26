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

	// Customer Routes
	router.get("/mine",
		protectRoute,
		validationMiddleware(getMineOrdersSchema),
		orderController.getAllMine
	);

	router.get("/mine/:id",
		protectRoute,
		validationMiddleware(orderIdSchema),
		orderController.getMineById
	);

	// Admin Routes
	router.get("/number/:orderNumber",
		protectRoute,
		adminRoute,
		validationMiddleware(orderNumberSchema),
		orderController.getByOrderNumber
	);

	router.get("/payment-session/:sessionId",
		protectRoute,
		adminRoute,
		validationMiddleware(paymentSessionIdSchema),
		orderController.getByPaymentId
	);

	router.get("/",
		protectRoute,
		adminRoute,
		validationMiddleware(getAllOrdersSchema),
		orderController.getAll
	);

	router.get("/:id",
		protectRoute,
		adminRoute,
		validationMiddleware(orderIdSchema),
		orderController.getById
	);

	router.patch("/:id/status",
		protectRoute,
		adminRoute,
		validationMiddleware(updateOrderStatusSchema),
		orderController.updateStatus
	);
}