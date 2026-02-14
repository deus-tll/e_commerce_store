import {ShortUserDTO, PaginationMetadata} from "../index.js";

/**
 * Agnostic class for nested product item data.
 * Used for the Repository layer (Entity) and Creation/Update Data.
 * Includes snapshot data for order immutability.
 */
export class OrderProductItem {
	/** @type {string} @readonly */ id;
	/** @type {number} @readonly */ quantity;
	/** @type {number} @readonly */ price;
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ image;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id;
		this.quantity = data.quantity;
		this.price = data.price;
		this.name = data.name;
		this.image = data.image;

		Object.freeze(this);
	}
}

/**
 * Agnostic class representing the core Order Entity, used by the Repository layer.
 * All complex relationships are represented by string IDs (e.g., 'userId', 'productId').
 */
export class OrderEntity {
	/** @type {string} @readonly */ id;
	/** @type {string | null} @readonly */ userId;
	/** @type {OrderProductItem[]} @readonly */ products;
	/** @type {number} @readonly */ totalAmount;
	/** @type {string | undefined} @readonly */ paymentSessionId;
	/** @type {string} @readonly */ orderNumber;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id;
		this.userId = data.userId;
		this.products = Object.freeze([...data.products]);
		this.totalAmount = data.totalAmount;
		this.paymentSessionId = data.paymentSessionId;
		this.orderNumber = data.orderNumber;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		Object.freeze(this);
	}
}

/**
 * Agnostic class for creating a new Order.
 */
export class CreateOrderDTO {
	/** @type {OrderProductItem[]} @readonly */ products;
	/** @type {number} @readonly */ totalAmount;
	/** @type {string | undefined} @readonly */ paymentSessionId;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.products = Object.freeze([...data.products]);
		this.totalAmount = data.totalAmount;
		this.paymentSessionId = data.paymentSessionId;

		Object.freeze(this);
	}

	/**
	 * Transforms the DTO into a clean object for the Repository.
	 * @returns {Object}
	 */
	toPersistence() {
		return Object.freeze({
			products: this.products,
			totalAmount: this.totalAmount,
			paymentSessionId: this.paymentSessionId
		});
	}
}

/**
 * Agnostic class for Order Data Transfer Object (DTO).
 * Replaces string IDs with populated DTO objects/variants (ShortUserDTO, OrderProductItem).
 */
export class OrderDTO {
	/** @type {string} @readonly */ id;
	/** @type {ShortUserDTO | null} @readonly */ user;
	/** @type {OrderProductItem[]} @readonly */ products;
	/** @type {number} @readonly */ totalAmount;
	/** @type {string | undefined} @readonly */ paymentSessionId;
	/** @type {string} @readonly */ orderNumber;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/**
	 * @param {OrderEntity} entity - The core order entity data.
	 * @param {ShortUserDTO | null} userShortDTO - The rich user data.
	 */
	constructor(entity, userShortDTO) {
		this.id = entity.id;
		this.user = userShortDTO;
		this.products = Object.freeze([...entity.products]);
		this.totalAmount = entity.totalAmount;
		this.paymentSessionId = entity.paymentSessionId;
		this.orderNumber = entity.orderNumber;
		this.createdAt = entity.createdAt;
		this.updatedAt = entity.updatedAt;

		Object.freeze(this);
	}
}

/**
 * Service-level pagination result DTO.
 */
export class OrderPaginationResultDTO {
	/** @type {OrderDTO[]} @readonly */ orders;
	/** @type {PaginationMetadata} @readonly */ pagination;

	/**
	 * @param {OrderDTO[]} orders
	 * @param {PaginationMetadata} pagination
	 */
	constructor(orders, pagination) {
		this.orders = Object.freeze([...orders]);
		this.pagination = pagination;

		Object.freeze(this);
	}
}

/**
 * Agnostic structure for Sales Summary Result.
 */
export class SalesSummaryDTO {
	/** @type {number} @readonly */ totalSales;
	/** @type {number} @readonly */ totalRevenue;

	/**
	 * @param {number} totalSales
	 * @param {number} totalRevenue
	 */
	constructor(totalSales, totalRevenue) {
		this.totalSales = totalSales;
		this.totalRevenue = totalRevenue;

		Object.freeze(this);
	}
}

/**
 * Agnostic structure for Daily Sales Summary Result.
 */
export class DailySalesSummaryDTO {
	/** @type {string} @readonly */ date;
	/** @type {number} @readonly */ salesCount;
	/** @type {number} @readonly */ totalRevenue;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.date = data.date;
		this.salesCount = data.salesCount;
		this.totalRevenue = data.totalRevenue;

		Object.freeze(this);
	}
}