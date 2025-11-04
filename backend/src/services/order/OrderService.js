import {IOrderService} from "../../interfaces/order/IOrderService.js";
import {IOrderRepository} from "../../interfaces/repositories/IOrderRepository.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {IOrderMapper} from "../../interfaces/mappers/IOrderMapper.js";
import {OrderPaginationResultDTO, PaginationMetadata} from "../../domain/index.js";

import {NotFoundError} from "../../errors/apiErrors.js";

/**
 * Agnostic business logic layer for order operations.
 * Coordinates between the Order Repository and User Service.
 * @augments IOrderService
 */
export class OrderService extends IOrderService {
	/** @type {IOrderRepository} */ #orderRepository;
	/** @type {IUserService} */ #userService;
	/** @type {IOrderMapper} */ #orderMapper;

	/**
	 * @param {IOrderRepository} orderRepository
	 * @param {IUserService} userService
	 * @param {IOrderMapper} orderMapper
	 */
	constructor(orderRepository, userService, orderMapper) {
		super();
		this.#orderRepository = orderRepository;
		this.#userService = userService;
		this.#orderMapper = orderMapper;
	}

	async create(data) {
		await this.#userService.getByIdOrFail(data.userId);

		const createdOrder = await this.#orderRepository.create(data);

		return await this.#orderMapper.toDTO(createdOrder);
	}

	async update(id, data) {
		const updatedOrder = await this.#orderRepository.updateById(id, data);

		if (!updatedOrder) throw new NotFoundError("Order not found or no updates were applied");

		return await this.#orderMapper.toDTO(updatedOrder);
	}

	async getById(id) {
		const orderEntity = await this.#orderRepository.findById(id);

		if (!orderEntity) return null;

		return await this.#orderMapper.toDTO(orderEntity);
	}

	async getByIdOrFail(id) {
		const orderDTO = await this.getById(id);

		if (!orderDTO) throw new NotFoundError(`Order with ID ${id} not found`);

		return orderDTO;
	}

	async getByPaymentSessionId(sessionId) {
		const orderEntity = await this.#orderRepository.findByPaymentSessionId(sessionId);

		if (!orderEntity) return null;

		return await this.#orderMapper.toDTO(orderEntity);
	}

	async getByPaymentSessionIdOrFail(sessionId) {
		const orderDTO = await this.getByPaymentSessionId(sessionId);

		if (!orderDTO) throw new NotFoundError(`Order with session ID ${sessionId} not found`);

		return orderDTO;
	}

	async getAllByUser(userId, page = 1, limit = 10) {
		await this.#userService.getByIdOrFail(userId);

		const skip = (page - 1) * limit;

		const repositoryPaginationResult = await this.#orderRepository.findAndCountByUser(userId, skip, limit);

		const total = repositoryPaginationResult.total;
		const pages = Math.ceil(total / limit);

		const orderDTOs = await Promise.all(
			repositoryPaginationResult.results.map(entity => this.#orderMapper.toDTO(entity))
		);

		const paginationMetadata = new PaginationMetadata(page, limit, total, pages);

		return new OrderPaginationResultDTO(orderDTOs, paginationMetadata);
	}
}