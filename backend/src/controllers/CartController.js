import {ICartService} from "../interfaces/cart/ICartService.js";

/**
 * Handles incoming HTTP requests related to the user's shopping cart, focusing on
 * extracting request data and delegating business logic to the ICartService.
 */
export class CartController {
	/** @type {ICartService} */ #cartService;

	/**
	 * @param {ICartService} cartService
	 */
	constructor(cartService) {
		this.#cartService = cartService;
	}

	/**
	 * Adds a single product to the authenticated user's cart.
	 * @param {object} req - Express request object. Expects 'productId' in 'req.body' and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 201 and the updated array of CartItemDTOs.
	 */
	addProduct = async (req, res, next) => {
		try {
			const { productId } = req.body;

			const cartItems = await this.#cartService.addProduct(req.userId, productId);

			return res.status(201).json(cartItems);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Removes a specific product entirely from the authenticated user's cart.
	 * @param {object} req - Express request object. Expects 'productId' in req.params and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the updated array of CartItemDTOs.
	 */
	removeProduct = async (req, res, next) => {
		try {
			const { productId } = req.params;

			const cartItems = await this.#cartService.removeProduct(req.userId, productId);

			return res.status(200).json(cartItems);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Clears all items from the authenticated user's cart.
	 * @param {object} req - Express request object. Expects 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the newly cleared array of CartItemDTOs.
	 */
	clear = async (req, res, next) => {
		try {
			const cartItems = await this.#cartService.clear(req.userId);

			return res.status(200).json(cartItems);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Updates the quantity of a specific product in the authenticated user's cart.
	 * @param {object} req - Express request object. Expects 'productId' in req.params, 'quantity' in 'req.body', and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the updated array of CartItemDTOs.
	 */
	updateProductQuantity = async (req, res, next) => {
		try {
			const { productId } = req.params;
			const { quantity } = req.body;

			const cartItems = await this.#cartService.updateProductQuantity(req.userId, productId, quantity);

			return res.status(200).json(cartItems);
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves the complete shopping cart details for the authenticated user, including product details.
	 * @param {object} req - Express request object. Expects 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the array of CartItemDTOs.
	 */
	getCartItems = async (req, res, next) => {
		try {
			const cartItems = await this.#cartService.getCartItems(req.userId);

			return res.status(200).json(cartItems);
		} catch (error) {
			next(error);
		}
	}
}