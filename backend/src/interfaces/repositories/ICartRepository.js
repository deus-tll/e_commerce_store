import { CartEntity, CreateCartDTO, CartItemEntity } from "../../domain/index.js";

/**
 * @interface ICartRepository
 * @description Contract for working with cart data in the persistence layer.
 */
export class ICartRepository {
	/**
	 * Creates a new cart record.
	 * @param {CreateCartDTO} data - The data for the new cart.
	 * @returns {Promise<CartEntity>} - The newly created cart record.
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Adds an item to the cart or increments the quantity if the item already exists.
	 * @param {string} userId - The user ID.
	 * @param {string} productId - The ID of the product to add/increment.
	 * @returns {Promise<CartEntity | null>} - The updated cart record.
	 */
	async addItemOrIncrement(userId, productId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Removes a specific item from the cart.
	 * @param {string} userId - The user ID.
	 * @param {string} productId - The ID of the product to remove.
	 * @returns {Promise<CartEntity | null>} - The updated cart record.
	 */
	async removeItem(userId, productId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates the quantity of a specific item in the cart. If quantity is 0, the item is removed.
	 * @param {string} userId - The user ID.
	 * @param {string} productId - The ID of the product to update.
	 * @param {number} quantity - The new quantity (must be >= 0).
	 * @returns {Promise<CartEntity | null>} - The updated cart record.
	 */
	async updateItemQuantity(userId, productId, quantity) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates the items array for a specific user's cart.
	 * @param {string} userId - The user ID.
	 * @param {CartItemEntity[]} newItems - The complete new array of items.
	 * @returns {Promise<CartEntity | null>} - The updated cart record.
	 */
	async updateItemsByUserId(userId, newItems) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a cart entity by the owning user ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<CartEntity | null>} - The found cart record.
	 */
	async findByUserId(userId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Checks if a cart exists for a given user ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<boolean>}
	 */
	async existsByUserId(userId) {
		throw new Error("Method not implemented.");
	}
}