import express from "express";

import {protectRoute} from "../middleware/authMiddleware.js";
import {CouponController} from "../controllers/CouponController.js";

const router = express.Router();
const couponController = new CouponController();

router.get("/", protectRoute, couponController.getCoupon);
router.post("/validate", protectRoute, couponController.validateCoupon);

export default router;