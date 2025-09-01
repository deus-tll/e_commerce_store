import express from "express";

import {protectRoute} from "../middleware/authMiddleware.js";
import {
	getCartProducts,
	addProductToCart,
	removeProductFromCart,
	clearCart,
	updateProductQuantityInCart
} from "../controllers/cart.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addProductToCart);
router.delete("/:productId", protectRoute, removeProductFromCart);
router.delete("/", protectRoute, clearCart);
router.put("/:productId", protectRoute, updateProductQuantityInCart);

export default router;