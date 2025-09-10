import express from "express";
import {AuthController} from "../controllers/auth.js";
import {protectRoute} from "../middleware/authMiddleware.js";

const router = express.Router();
const authController = new AuthController();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/profile", protectRoute, authController.getProfile);
router.post("/refresh-token", authController.refreshAccessToken);

export default router;