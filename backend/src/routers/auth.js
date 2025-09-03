import express from "express";
import {signup, login, logout, refreshAccessToken, getProfile} from "../controllers/auth.js";
import {protectRoute} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshAccessToken);
router.get("/profile", protectRoute, getProfile);

export default router;