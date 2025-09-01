import express from "express";

import {adminRoute, protectRoute} from "../middleware/authMiddleware.js";
import getAnalytics from "../controllers/analytics.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAnalytics)

export default router;