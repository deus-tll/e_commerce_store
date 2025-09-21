import express from "express";
import { UserController } from "../controllers/UserController.js";
import { protectRoute, adminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();
const userController = new UserController();

router.use(protectRoute);
router.use(adminRoute);

router.get("/", userController.getAllUsers);
router.get("/stats", userController.getUserStats);
router.get("/:userId", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);

export default router;