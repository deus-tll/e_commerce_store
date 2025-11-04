import {ShortProductDTO} from "../index.js";

/**
 * Agnostic class for nested product item data.
 * Used for the Repository layer (Entity) and Data Input.
 */
export class CartItemEntity {
	/** @type {string} */ productId;
	/** @type {number} */ quantity;

	/**
	 * @param {object} data
	 * @param {string} data.productId
	 * @param {number} data.quantity
	 */
	constructor({ productId, quantity }) {
		this.productId = productId.toString();
		this.quantity = quantity;
	}
}

/**
 * Agnostic class representing the core Cart Entity, used by the Repository layer.
 */
export class CartEntity {
	/** @type {string} */ id;
	/** @type {string} */ userId;
	/** @type {CartItemEntity[]} */ items;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {object} data
	 * @param {string} data.id
	 * @param {string} data.userId - The agnostic field name.
	 * @param {Array<object>} data.items
	 */
	constructor({ id, userId, items, createdAt, updatedAt }) {
		if (!id) {
			throw new Error("CartEntity requires an ID.");
		}
		this.id = id.toString();
		this.userId = userId.toString();
		this.items = items.map(item => new CartItemEntity({
			productId: item.productId,
			quantity: item.quantity
		}));
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}

/**
 * Agnostic class for input data when creating a Cart.
 */
export class CreateCartDTO {
	/** @type {string} */ userId;
	/** @type {CartItemEntity[]} */ items;

	/**
	 * @param {object} data - Raw data for creation.
	 */
	constructor({ userId, items = [] }) {
		this.userId = userId;
		this.items = items.map(item => new CartItemEntity(item));
	}
}

/**
 * Data Transfer Object for an individual Cart Item, used by the Service layer.
 * This DTO is typically enriched with product details.
 */
export class CartItemDTO {
	/** @type {ShortProductDTO} */ product;
	/** @type {number} */ quantity;

	/**
	 * @param {object} data
	 * @param {ShortProductDTO} data.product
	 * @param {number} data.quantity
	 */
	constructor({ product, quantity }) {
		this.product = product;
		this.quantity = quantity;
	}
}

/**
 * Data Transfer Object for the full Cart, used by the Service layer.
 */
export class CartDTO {
	/** @type {string} */ id;
	/** @type {string} */ userId;
	/** @type {CartItemDTO[]} */ items;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor({ id, userId, items, createdAt, updatedAt }) {
		this.id = id;
		this.userId = userId;
		this.items = items;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}