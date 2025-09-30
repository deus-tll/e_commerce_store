import express from "express";

import {adminRoute, protectRoute} from "../middleware/authMiddleware.js";
import {ProductController} from "../controllers/ProductController.js";

const router = express.Router();
const productController = new ProductController();

router.get("/", protectRoute, adminRoute, productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/recommended", productController.getRecommendedProducts);
router.get("/:id", productController.getProductById);
router.post("/", protectRoute, adminRoute, productController.createProduct);
router.put("/:id", protectRoute, adminRoute, productController.updateProduct);
router.patch("/:id", protectRoute, adminRoute, productController.toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, productController.deleteProduct);

export default router;