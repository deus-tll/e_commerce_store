import express from "express";
import { CategoryController } from "../controllers/CategoryController.js";
import { adminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();
const categoryController = new CategoryController();

router.get("/", categoryController.getAll);
router.post("/", protectRoute, adminRoute, categoryController.create);
router.put("/:id", protectRoute, adminRoute, categoryController.update);
router.delete("/:id", protectRoute, adminRoute, categoryController.delete);

export default router;