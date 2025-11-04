import {
	CreateOrderDTO,
	UpdateOrderDTO,
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
	 * @param {CreateOrderDTO} data - The data for the new order.
	 * @returns {Promise<OrderDTO>} - The newly created order DTO.
	 */
	async create(data) { throw new Error("Method not implemented."); }

	/**
	 * Updates an existing order.
	 * @param {string} id - The order ID.
	 * @param {UpdateOrderDTO} data - The data for the update order.
	 * @returns {Promise<OrderDTO>} - The updated order DTO.
	 */
	async update(id, data) { throw new Error("Method not implemented."); }

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
	 * Gets a paginated list of orders for a specific user.
	 * @param {string} userId - The user ID.
	 * @param {number} [page] - The page number.
	 * @param {number} [limit] - The maximum number of documents per page.
	 * @returns {Promise<OrderPaginationResultDTO>} - The paginated list of orders.
	 */
	async getAllByUser(userId, page, limit) { throw new Error("Method not implemented."); }
}