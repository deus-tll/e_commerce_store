import {
	OrderEntity,
	CreateOrderDTO,
	UpdateOrderDTO,
	SalesSummaryDTO,
	DailySalesSummaryDTO,
	RepositoryPaginationResult
} from "../../domain/index.js";

/**
 * @interface IOrderRepository
 * @description Contract for working with order data in the persistence layer.
 */
export class IOrderRepository {
	/**
	 * Creates and saves a new order record.
	 * @param {CreateOrderDTO} data - The data for the new order.
	 * @returns {Promise<OrderEntity>} - The newly created order record.
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates an order record by its ID.
	 * @param {string} id - The order ID.
	 * @param {UpdateOrderDTO} data - The data for the update order.
	 * @returns {Promise<OrderEntity | null>} - The updated order record.
	 */
	async updateById(id, data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds an order record by its ID.
	 * @param {string} id - The order ID.
	 * @param {object} [options] - Options like population paths.
	 * @returns {Promise<OrderEntity | null>} - The found order record.
	 */
	async findById(id, options) {
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
	 * Finds orders and their total count for pagination purposes, filtered by user ID.
	 * @param {string} userId - The user ID.
	 * @param {number} skip - The number of documents to skip.
	 * @param {number} limit - The maximum number of documents to return.
	 * @returns {Promise<RepositoryPaginationResult<OrderEntity>>} - The paginated results.
	 */
	async findAndCountByUser(userId, skip, limit) {
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