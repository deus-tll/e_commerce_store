import express from "express";

import {protectRoute} from "../middleware/authMiddleware.js";
import {CartController} from "../controllers/CartController.js";

const router = express.Router();
const cartController = new CartController();

router.get("/", protectRoute, cartController.getCartProducts);
router.post("/", protectRoute, cartController.addProductToCart);
router.delete("/:productId", protectRoute, cartController.removeProductFromCart);
router.delete("/", protectRoute, cartController.clearCart);
router.put("/:productId", protectRoute, cartController.updateProductQuantityInCart);

export default router;