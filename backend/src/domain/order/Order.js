import {ShortUserDTO, PaginationMetadata} from "../index.js";

/**
 * Agnostic class for nested product item data.
 * Used for the Repository layer (Entity) and Creation/Update Data.
 * Includes snapshot data for order immutability.
 */
export class OrderProductItem {
	/** @type {string} */ id;
	/** @type {number} */ quantity;
	/** @type {number} */ price;
	/** @type {string} */ name;
	/** @type {string} */ image;

	/**
	 * @param {object} data
	 * @param {string} data.id
	 * @param {number} data.quantity
	 * @param {number} data.price
	 * @param {string} data.name
	 * @param {string} data.image
	 */
	constructor({ id, quantity, price, name, image }) {
		this.id = id;
		this.quantity = quantity;
		this.price = price;
		this.name = name;
		this.image = image;
	}
}

/**
 * Agnostic class representing the core Order Entity, used by the Repository layer.
 * All complex relationships are represented by string IDs (e.g., 'userId', 'productId').
 */
export class OrderEntity {
	/** @type {string} */ id;
	/** @type {string | null} */ userId;
	/** @type {OrderProductItem[]} */ products;
	/** @type {number} */ totalAmount;
	/** @type {string | undefined} */ paymentSessionId;
	/** @type {string} */ orderNumber;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor({ id, userId, products, totalAmount, paymentSessionId, orderNumber, createdAt, updatedAt }) {
		this.id = id;
		this.userId = userId;
		this.products = products.map(item => new OrderProductItem(item));
		this.totalAmount = totalAmount;
		this.paymentSessionId = paymentSessionId;
		this.orderNumber = orderNumber;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}

/**
 * Agnostic class for creating a new Order.
 */
export class CreateOrderDTO {
	/** @type {string} */ userId;
	/** @type {OrderProductItem[]} */ products;
	/** @type {number} */ totalAmount;
	/** @type {string | undefined} */ paymentSessionId;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.userId = data.userId;
		this.products = data.products.map(item => new OrderProductItem(item));
		this.totalAmount = data.totalAmount;
		this.paymentSessionId = data.paymentSessionId;
	}
}

/**
 * Agnostic class for input data when updating an Order.
 * Minimal fields as orders are generally immutable.
 */
export class UpdateOrderDTO {
	/** @type {string} [paymentSessionId] */ paymentSessionId;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		if (data.paymentSessionId !== undefined) this.paymentSessionId = data.paymentSessionId;
	}

	/**
	 * Returns an object containing only the fields that were explicitly
	 * provided by the caller for update.
	 * @returns {object} An object with only the fields to be updated.
	 */
	toUpdateObject() {
		const update = {};

		if (this.paymentSessionId !== undefined) {
			update.paymentSessionId = this.paymentSessionId;
		}

		return update;
	}
}

/**
 * Agnostic class for Order Data Transfer Object (DTO).
 * Replaces string IDs with populated DTO objects/variants (ShortUserDTO, OrderProductItem).
 */
export class OrderDTO {
	/** @type {string} */ id;
	/** @type {ShortUserDTO | null} */ user;
	/** @type {OrderProductItem[]} */ products;
	/** @type {number} */ totalAmount;
	/** @type {string | undefined} */ paymentSessionId;
	/** @type {string} */ orderNumber;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {OrderEntity} entity - The core order entity data.
	 * @param {ShortUserDTO | null} userShortDTO - The rich user data.
	 */
	constructor(entity, userShortDTO) {
		this.id = entity.id;
		this.user = userShortDTO;
		this.products = entity.products;
		this.totalAmount = entity.totalAmount;
		this.paymentSessionId = entity.paymentSessionId;
		this.orderNumber = entity.orderNumber;
		this.createdAt = entity.createdAt;
		this.updatedAt = entity.updatedAt;
	}
}

/**
 * Service-level pagination result DTO.
 */
export class OrderPaginationResultDTO {
	/** @type {OrderDTO[]} */ orders;
	/** @type {PaginationMetadata} */ pagination;

	/**
	 * @param {OrderDTO[]} orders
	 * @param {PaginationMetadata} pagination
	 */
	constructor(orders, pagination) {
		this.orders = orders;
		this.pagination = pagination;
	}
}

/**
 * Agnostic structure for Sales Summary Result.
 */
export class SalesSummaryDTO {
	/** @type {number} */ totalSales;
	/** @type {number} */ totalRevenue;

	/**
	 * @param {number} totalSales
	 * @param {number} totalRevenue
	 */
	constructor(totalSales, totalRevenue) {
		this.totalSales = totalSales;
		this.totalRevenue = totalRevenue;
	}
}

/**
 * Agnostic structure for Daily Sales Summary Result.
 */
export class DailySalesSummaryDTO {
	/** @type {string} */ date;
	/** @type {number} */ salesCount;
	/** @type {number} */ totalRevenue;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.date = data.date;
		this.salesCount = data.salesCount;
		this.totalRevenue = data.totalRevenue;
	}
}