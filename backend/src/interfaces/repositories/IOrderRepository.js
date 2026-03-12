import {
	OrderEntity,
	SalesSummaryDTO,
	DailySalesSummaryDTO,
	RepositoryPaginationResult
} from "../../domain/index.js";
import {OrderStatus} from "../../constants/domain.js";

/**
 * @typedef {import("../../domain/index.js").OrderEntity} OrderEntity
 * @typedef {import("../../domain/index.js").RepositoryPaginationResult<OrderEntity>} OrderPaginationResult
 */

/**
 * @interface IOrderRepository
 * @description Contract for working with order data in the persistence layer.
 */
export class IOrderRepository {
	/**
	 * Creates and saves a new order record.
	 * @param {string} userId - The user ID.
	 * @param {Object} data - The data for the new order.
	 * @returns {Promise<OrderEntity>} - The newly created order record.
	 */
	async create(userId, data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates status of an order.
	 * @param {string} id - The order ID.
	 * @param {keyof OrderStatus} status
	 * @returns {Promise<OrderEntity>}
	 */
	async updateStatus(id, status) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds an order record by its ID.
	 * @param {string} id - The order ID.
	 * @returns {Promise<OrderEntity | null>} - The found order record.
	 */
	async findById(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds an order record by its ID and user ID.
	 * @param {string} id - The order ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<OrderEntity | null>} - The found order record.
	 */
	async findByIdAndUser(id, userId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds an order record by its payment session ID.
	 * @param {string} sessionId - The payment session ID.
	 * @returns {Promise<OrderEntity | null>} - The found order record.
	 */
	async findByPaymentSessionId(sessionId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds an order record by its order number.
	 * @param {string} orderNumber - The order number.
	 * @returns {Promise<OrderEntity | null>} - The found order record.
	 */
	async findByOrderNumber(orderNumber) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds orders and their total count for pagination purposes.
	 * @param {object} query - The filtering query.
	 * @param {number} skip - The number of documents to skip.
	 * @param {number} limit - The maximum number of documents to return.
	 * @param {object} [options={}] - Options(such as sortBy and order).
	 * @returns {Promise<RepositoryPaginationResult<OrderEntity>>}
	 */
	async findAndCount(query, skip, limit, options) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Calculates aggregated sales and revenue.
	 * @returns {Promise<SalesSummaryDTO>} - The aggregated sales summary.
	 */
	async getSalesSummary() {
		throw new Error("Method not implemented.");
	}

	/**
	 * Calculates daily sales and revenue within a date range.
	 * @param {Date} startDate - The start date for the summary.
	 * @param {Date} endDate - The end date for the summary.
	 * @returns {Promise<DailySalesSummaryDTO[]>} - A list of daily sales summaries.
	 */
	async getDailySalesSummary(startDate, endDate) {
		throw new Error("Method not implemented.");
	}
}