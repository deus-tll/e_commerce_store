import { IOrderService } from "../interfaces/order/IOrderService.js";

/**
 * Handles incoming HTTP requests related to orders.
 * Coordinates between Admin management and Customer personal order access.
 */
export class OrderController {
	/** @type {IOrderService} */ #orderService;

	/**
	 * @param {IOrderService} orderService - An instance that implements the IOrderService contract.
	 */
	constructor(orderService) {
		this.#orderService = orderService;
	}

	/**
	 * Updates the status of an order. (Admin protected).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the updated OrderDTO.
	 */
	updateStatus = async (req, res) => {
		const { id } = req.params;
		const { status } = req.body;

		const orderDTO = await this.#orderService.updateStatus(id, status);

		return res.status(200).json(orderDTO);
	}

	/**
	 * Retrieves a paginated and filtered list of all orders. (Admin protected).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and an OrderPaginationResultDTO.
	 */
	getAll = async (req, res) => {
		const { page, limit, ...filters } = req.query;
		const paginationResult = await this.#orderService.getAll(page, limit, filters);

		return res.status(200).json(paginationResult);
	}

	/**
	 * Retrieves a single order's full details by ID. (Admin protected).
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the requested OrderDTO.
	 */
	getById = async (req, res) => {
		const { id } = req.params;
		const orderDTO = await this.#orderService.getByIdOrFail(id);

		return res.status(200).json(orderDTO);
	}

	/**
	 * Retrieves a paginated list of orders for the currently authenticated user.
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and an OrderPaginationResultDTO.
	 */
	getAllMine = async (req, res) => {
		const { page, limit, ...rest } = req.query;
		const paginationResult = await this.#orderService.getAll(page, limit, { ...rest, userId: req.userId });

		return res.status(200).json(paginationResult);
	}

	/**
	 * Retrieves a single order's details by ID for the authenticated owner.
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the requested OrderDTO.
	 */
	getMineById = async (req, res) => {
		const { id } = req.params;
		const orderDTO = await this.#orderService.getByIdAndUserOrFail(id, req.userId);

		return res.status(200).json(orderDTO);
	}

	/**
	 * Retrieves a single order by its human-readable order number. (Admin protected).
	 * @param {object} req - Express request object. Expects 'orderNumber' in req.params.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the requested OrderDTO.
	 */
	getByOrderNumber = async (req, res) => {
		const { orderNumber } = req.params;
		const orderDTO = await this.#orderService.getByOrderNumberOrFail(orderNumber);

		return res.status(200).json(orderDTO);
	}

	/**
	 * Retrieves a single order by its payment provider session ID. (Admin protected).
	 * @param {object} req - Express request object. Expects 'sessionId' in req.params.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the requested OrderDTO.
	 */
	getByPaymentId = async (req, res) => {
		const { sessionId } = req.params;
		const orderDTO = await this.#orderService.getByPaymentSessionIdOrFail(sessionId);

		return res.status(200).json(orderDTO);
	}
}