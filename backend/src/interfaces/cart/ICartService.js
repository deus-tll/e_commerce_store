import {CartItemDTO} from "../../domain/index.js";

/**
 * @interface IProductService
 * @description Agnostic business logic layer for cart operations.
 */
export class ICartService {
	/**
	 * Adds a product to the cart or increments its quantity.
	 * @param {string} userId - The user ID.
	 * @param {string} productId - The product ID.
	 * @returns {Promise<CartItemDTO[]>} - The updated list of cart items.
	 */
	async addProduct(userId, productId) { throw new Error("Method not implemented."); }

	/**
	 * Removes a specific product from the cart.
	 * @param {string} userId - The user ID.
	 * @param {string} productId - The product ID.
	 * @returns {Promise<CartItemDTO[]>} - The updated list of cart items.
	 */
	async removeProduct(userId, productId) { throw new Error("Method not implemented."); }

	/**
	 * Sets a product's quantity in the cart.
	 * @param {string} userId - The user ID.
	 * @param {string} productId - The product ID.
	 * @param {number} quantity - The new quantity.
	 * @returns {Promise<CartItemDTO[]>} - The updated list of cart items.
	 */
	async updateProductQuantity(userId, productId, quantity) { throw new Error("Method not implemented."); }

	/**
	 * Clears all items from the user's cart.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CartItemDTO[]>} - An empty list of cart items.
	 */
	async clear(userId) { throw new Error("Method not implemented."); }

	/**
	 * Retrieves the content of the user's cart.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CartItemDTO[]>} - A list of cart items enriched with product data.
	 */
	async getCartItems(userId) { throw new Error("Method not implemented."); }
}