import express from "express";
import {adminRoute, createProtectRoute} from "../middleware/authMiddleware.js";

/**
 * @typedef {import('../interfaces/IAuthService.js').IAuthService} IAuthService
 * @typedef {import('../controllers/UserController.js').UserController} UserController
 */

/**
 * Factory that creates and configures the User router, injecting necessary dependencies.
 * @param {UserController} userController - The user controller instance.
 * @param {IAuthService} authService - The authentication service instance, required for protectRoute.
 * @returns {core.Router} - Configured Express router.
 */
export function createUsersRouter(userController, authService) {
	const router = express.Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);
	router.use(adminRoute);

	router.get("/", userController.getAllUsers);
	router.get("/stats", userController.getUserStats);
	router.get("/:userId", userController.getUserById);
	router.post("/", userController.createUser);
	router.put("/:userId", userController.updateUser);
	router.delete("/:userId", userController.deleteUser);

	return router;
}