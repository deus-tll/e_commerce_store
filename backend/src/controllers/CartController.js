import {CartService} from "../services/CartService.js";

export class CartController {
	constructor() {
		this.cartService = new CartService();
	}

	getCartProducts = async (req, res, next) => {
		try {
			const cartItems = await this.cartService.getCartProducts(req.user);
			res.status(200).json(cartItems);
		} catch (error) {
			next(error);
		}
	}

	addProductToCart = async (req, res, next) => {
		try {
			const { productId } = req.body;
			const cartItems = await this.cartService.addProductToCart(req.user, productId);

			res.status(201).json(cartItems);
		} catch (error) {
			next(error);
		}
	}

	removeProductFromCart = async (req, res, next) => {
		try {
			const { productId } = req.params;
			const cartItems = await this.cartService.removeProductFromCart(req.user, productId);

			res.status(200).json(cartItems);
		} catch (error) {
			next(error);
		}
	}

	clearCart = async (req, res, next) => {
		try {
			await this.cartService.clearCart(req.user);
			res.status(204).end();
		} catch (error) {
			next(error);
		}
	}

	updateProductQuantityInCart = async (req, res, next) => {
		try {
			const { productId } = req.params;
			const { quantity } = req.body;
			const cartItems = await this.cartService.updateProductQuantityInCart(req.user, productId, quantity);

			res.status(200).json(cartItems);
		} catch (error) {
			next(error);
		}
	}
}