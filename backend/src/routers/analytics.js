import express from "express";

import {adminRoute, protectRoute} from "../middleware/authMiddleware.js";
import {AnalyticsController} from "../controllers/AnalyticsController.js";

const router = express.Router();
const analyticsController = new AnalyticsController();

router.get("/", protectRoute, adminRoute, analyticsController.getAnalytics)

export default router;