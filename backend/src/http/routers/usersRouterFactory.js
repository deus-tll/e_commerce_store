import express from "express";

import {UserController} from "../../controllers/UserController.js";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {
	getAllUsersSchema,
	userIdParamSchema,
	createUserSchema,
	updateUserSchema
} from "../validators/userValidator.js";

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

	router.get("/", validationMiddleware(getAllUsersSchema), userController.getAll);
	router.get("/stats", userController.getStats);
	router.get("/:userId", validationMiddleware(userIdParamSchema), userController.getById);
	router.post("/", validationMiddleware(createUserSchema), userController.create);
	router.patch("/:userId", validationMiddleware(updateUserSchema), userController.update);
	router.delete("/:userId", validationMiddleware(userIdParamSchema), userController.delete);

	return router;
}