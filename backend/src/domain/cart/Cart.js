import {ShortProductDTO} from "../index.js";

/**
 * Agnostic class for nested product item data.
 * Used for the Repository layer (Entity) and Data Input.
 */
export class CartItemEntity {
	/** @type {string} @readonly */ productId;
	/** @type {number} @readonly */ quantity;

	/**
	 * @param {object} data
	 * @param {string} data.productId
	 * @param {number} data.quantity
	 */
	constructor({ productId, quantity }) {
		this.productId = productId;
		this.quantity = quantity;

		Object.freeze(this);
	}
}

/**
 * Agnostic class representing the core Cart Entity, used by the Repository layer.
 */
export class CartEntity {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ userId;
	/** @type {CartItemEntity[]} @readonly */ items;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id;
		this.userId = data.userId;
		this.items = Object.freeze([...data.items]);
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		Object.freeze(this);
	}
}

/**
 * Data Transfer Object for an individual Cart Item, used by the Service layer.
 * This DTO is typically enriched with product details.
 */
export class CartItemDTO {
	/** @type {ShortProductDTO} @readonly */ product;
	/** @type {number} @readonly */ quantity;

	/**
	 * @param {object} data
	 * @param {ShortProductDTO} data.product
	 * @param {number} data.quantity
	 */
	constructor({ product, quantity }) {
		this.product = product;
		this.quantity = quantity;

		Object.freeze(this);
	}
}

/**
 * Data Transfer Object for the full Cart, used by the Service layer.
 */
export class CartDTO {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ userId;
	/** @type {CartItemDTO[]} @readonly */ items;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id;
		this.userId = data.userId;
		this.items = data.items;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		Object.freeze(this);
	}
}