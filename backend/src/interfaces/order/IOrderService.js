import {
	CreateOrderDTO,
	OrderDTO,
	OrderPaginationResultDTO
} from "../../domain/index.js";

/**
 * @interface IProductService
 * @description Agnostic business logic layer for order operations.
 */
export class IOrderService {
	/**
	 * Creates a new order.
	 * @param {string} userId - The user ID.
	 * @param {CreateOrderDTO} data - The data for the new order.
	 * @returns {Promise<OrderDTO>} - The newly created order DTO.
	 */
	async create(userId, data) { throw new Error("Method not implemented."); }

	/**
	 * Updates the status of an existing order.
	 * @param {string} id - The order ID.
	 * @param {keyof OrderStatus} status - The new status.
	 * @returns {Promise<OrderDTO>} - The updated order DTO.
	 */
	async updateStatus(id, status) { throw new Error("Method not implemented."); }

	/**
	 * Finds an order by its ID.
	 * @param {string} id - The order ID.
	 * @returns {Promise<OrderDTO | null>} - The found order DTO.
	 */
	async getById(id) { throw new Error("Method not implemented."); }

	/**
	 * Finds an order by its ID, throwing an error if not found.
	 * @param {string} id - The order ID.
	 * @returns {Promise<OrderDTO>} - The found order DTO.
	 */
	async getByIdOrFail(id) { throw new Error("Method not implemented."); }

	/**
	 * Finds an order by its ID and owner User ID.
	 * @param {string} id - The order ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<OrderDTO | null>} - The found order DTO.
	 */
	async getByIdAndUser(id, userId) { throw new Error("Method not implemented."); }

	/**
	 * Finds an order by its ID and owner User ID, throwing an error if not found.
	 * @param {string} id - The order ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<OrderDTO>} - The found order DTO.
	 */
	async getByIdAndUserOrFail(id, userId) { throw new Error("Method not implemented."); }

	/**
	 * Finds an order by its payment session ID.
	 * @param {string} sessionId - The payment session ID.
	 * @returns {Promise<OrderDTO | null>} - The found order DTO.
	 */
	async getByPaymentSessionId(sessionId) { throw new Error("Method not implemented."); }

	/**
	 * Finds an order by its payment session ID, throwing an error if not found.
	 * @param {string} sessionId - The payment session ID.
	 * @returns {Promise<OrderDTO>} - The found order DTO.
	 */
	async getByPaymentSessionIdOrFail(sessionId) { throw new Error("Method not implemented."); }

	/**
	 * Finds an order by its order number.
	 * @param {string} orderNumber - The order number.
	 * @returns {Promise<OrderDTO | null>} - The found order DTO.
	 */
	async getByOrderNumber(orderNumber) { throw new Error("Method not implemented."); }

	/**
	 * Finds an order by its order number.
	 * @param {string} orderNumber - The order number.
	 * @returns {Promise<OrderDTO>} - The found order DTO.
	 */
	async getByOrderNumberOrFail(orderNumber) { throw new Error("Method not implemented."); }

	/**
	 * Gets orders with pagination and filtering.
	 * @param {number} [page] - The page number.
	 * @param {number} [limit] - The maximum number of documents per page.
	 * @param {object} [filters] - The filtering query object.
	 * @returns {Promise<OrderPaginationResultDTO>} - The paginated list of orders.
	 */
	async getAll(page, limit, filters) { throw new Error("Method not implemented."); }
}