import express from "express";

import {UserController} from "../../controllers/UserController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";

/**
 * A factory that creates and configures the User router, injecting necessary dependencies.
 * @param {UserController} userController
 * @param {ISessionAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createUsersRouter(userController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);
	router.use(adminRoute);

	router.get("/", userController.getAll);
	router.get("/stats", userController.getStats);
	router.get("/:userId", userController.getById);
	router.post("/", userController.create);
	router.put("/:userId", userController.update);
	router.delete("/:userId", userController.delete);

	return router;
}