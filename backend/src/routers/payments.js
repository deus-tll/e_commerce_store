import express from "express";

import { protectRoute } from "../middleware/authMiddleware.js";
import {PaymentController} from "../controllers/PaymentController.js";

const router = express.Router();
const paymentController = new PaymentController();

router.post("/create-checkout-session", protectRoute, paymentController.createCheckoutSession);
router.post("/checkout-success", protectRoute, paymentController.checkoutSuccess);

export default router;