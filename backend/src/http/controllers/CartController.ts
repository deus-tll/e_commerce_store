import {Request, Response} from "express";

import {CartService} from "../../application/cart/CartService.js";

import {CartAddItemRequest, CartUpdateItemQuantityRequest} from "../requests/cart.js";
import {ParamsWithProductIdRequest} from "../requests/shared.js";

export class CartController {
	constructor(
		private readonly cartService: CartService
	) {}

	addItem = async (req: CartAddItemRequest, res: Response): Promise<Response> => {
		const { productId } = req.body;
		const { id: userId } = req.user;

		const items = await this.cartService.addItem(userId, productId);

		return res.status(201).json(items);
	}

	removeItem = async (req: ParamsWithProductIdRequest, res: Response): Promise<Response> => {
		const { productId } = req.params;
		const { id: userId } = req.user;

		const items = await this.cartService.removeItem(userId, productId);

		return res.status(200).json(items);
	}

	clear = async (req: Request, res: Response): Promise<Response> => {
		const { id: userId } = req.user;
		const cartItems = await this.cartService.clear(userId);

		return res.status(200).json(cartItems);
	}

	updateItemQuantity = async (req: CartUpdateItemQuantityRequest, res: Response): Promise<Response> => {
		const { productId } = req.params;
		const { quantity } = req.body;
		const { id: userId } = req.user;

		const cartItems = await this.cartService.updateItemQuantity(userId, productId, quantity);

		return res.status(200).json(cartItems);
	}

	getItems = async (req: Request, res: Response): Promise<Response> => {
		const { id: userId } = req.user;
		const cartItems = await this.cartService.getCartItems(userId);
		return res.status(200).json(cartItems);
	}
}