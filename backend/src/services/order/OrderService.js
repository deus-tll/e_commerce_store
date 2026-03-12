import {IOrderService} from "../../interfaces/order/IOrderService.js";
import {IOrderRepository} from "../../interfaces/repositories/IOrderRepository.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {IOrderMapper} from "../../interfaces/mappers/IOrderMapper.js";
import {OrderPaginationResultDTO, PaginationMetadata} from "../../domain/index.js";

import {EntityNotFoundError} from "../../errors/index.js";

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

	async #formOrderDTO(entity) {
		const shortUserDTO = await this.#userService.getShortDTOById(entity.userId);
		return this.#orderMapper.toDTO(entity, shortUserDTO);
	}

	async #formOrderDTOs(entities) {
		const uniqueUserIds = [
			...new Set(entities.map(entity => entity.userId).filter(Boolean)),
		];
		const shortUserDTOs = await this.#userService.getShortDTOsByIds(uniqueUserIds);
		const userMap = new Map(shortUserDTOs.map(dto => [dto.id, dto]));

		return entities.map(entity => {
			const shortUserDTO = userMap.get(entity.userId);
			return this.#orderMapper.toDTO(entity, shortUserDTO);
		});
	}

	async create(userId, data) {
		await this.#userService.getByIdOrFail(userId);

		const createdOrder = await this.#orderRepository.create(userId, data.toPersistence());

		return await this.#formOrderDTO(createdOrder);
	}

	async updateStatus(id, status) {
		const updatedEntity = await this.#orderRepository.updateStatus(id, status);
		return await this.#formOrderDTO(updatedEntity);
	}

	async getById(id) {
		const orderEntity = await this.#orderRepository.findById(id);

		if (!orderEntity) return null;

		return await this.#formOrderDTO(orderEntity);
	}

	async getByIdOrFail(id) {
		const orderDTO = await this.getById(id);

		if (!orderDTO) throw new EntityNotFoundError("Order", { id });

		return orderDTO;
	}

	async getByIdAndUser(id, userId) {
		const orderEntity = await this.#orderRepository.findByIdAndUser(id, userId);
		return await this.#formOrderDTO(orderEntity);
	}

	async getByIdAndUserOrFail(id, userId) {
		const orderDTO = await this.getByIdAndUser(id, userId);

		if (!orderDTO) throw new EntityNotFoundError("Order", { id, userId });

		return orderDTO;
	}

	async getByPaymentSessionId(sessionId) {
		const orderEntity = await this.#orderRepository.findByPaymentSessionId(sessionId);

		if (!orderEntity) return null;

		return await this.#formOrderDTO(orderEntity);
	}

	async getByPaymentSessionIdOrFail(sessionId) {
		const orderDTO = await this.getByPaymentSessionId(sessionId);

		if (!orderDTO) throw new EntityNotFoundError("Order", { sessionId });

		return orderDTO;
	}

	async getByOrderNumber(orderNumber) {
		const orderEntity = await this.#orderRepository.findByOrderNumber(orderNumber);

		if (!orderEntity) return null;

		return await this.#formOrderDTO(orderEntity);
	}

	async getByOrderNumberOrFail(orderNumber) {
		const orderDTO = await this.getByOrderNumber(orderNumber);

		if (!orderDTO) throw new EntityNotFoundError("Order", { orderNumber });

		return orderDTO;
	}

	async getAll(page = 1, limit = 10, filters = {}) {
		const skip = (page - 1) * limit;
		const { sortBy, order } = filters;

		const query = {};

		if (filters.userId) query.userId = filters.userId;
		if (filters.status) query.status = filters.status;

		const { results, total } = await this.#orderRepository.findAndCount(query, skip, limit, { sortBy, order });

		const pages = Math.ceil(total / limit);
		const orderDTOs = await this.#formOrderDTOs(results);

		return new OrderPaginationResultDTO(
			orderDTOs,
			new PaginationMetadata(page, limit, total, pages)
		);
	}
}