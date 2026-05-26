import {Router} from "express";

import {CouponController} from "../controllers/CouponController.js";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {createProtectRoute} from "../middleware/authMiddleware.js";
import {validationMiddleware} from "../middleware/validationMiddleware.js";

import {validateCouponSchema} from "../validators/couponValidator.js";

export function setupCouponsRouter(
	couponController: CouponController,
	authService: SessionAuthService
): Router {
	const router = Router();

	const protectRoute = createProtectRoute(authService);

	router.use(protectRoute);

	router.get("/", couponController.get);
	router.post("/validate", validationMiddleware(validateCouponSchema), couponController.validate);

	return router;
}