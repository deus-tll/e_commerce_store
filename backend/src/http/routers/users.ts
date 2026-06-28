import {Router} from "express";

import {UserController} from "../controllers/UserController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {adminRoute, createProtectRoute} from "../middleware/auth.js";
import {validationMiddleware} from "../middleware/validation.js";

import {
	getAllUsersSchema,
	userIdParamSchema,
	createUserSchema,
	updateUserSchema
} from "../validators/user.js";

export function setupUsersRouter(
	userController: UserController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);
	router.use(adminRoute);

	router.get("/", validationMiddleware(getAllUsersSchema), userController.getAll);
	router.get("/stats", userController.getStats);
	router.get("/:id", validationMiddleware(userIdParamSchema), userController.getById);

	router.post("/", validationMiddleware(createUserSchema), userController.create);

	router.patch("/:id", validationMiddleware(updateUserSchema), userController.update);

	router.delete("/:id", validationMiddleware(userIdParamSchema), userController.delete);

	return router;
}