import {IOrderRepository} from "./IOrderRepository.js";
import {UserService} from "../user/UserService.js";
import {OrderMapper} from "./OrderMapper.js";

import {OrderEntity} from "../../entities/order/OrderEntity.js";
import {OrderCreateInput, OrderDTO, OrderFiltersInput, OrderPaginationResultDTO} from "../types/order.js";
import {PaginationMetadata} from "../types/shared.js";

import {EntityNotFoundError} from "../../errors/index.js";

import {OrderStatus} from "../../enums/application.js";

export class OrderService {
	constructor(
		private readonly orderRepository: IOrderRepository,
		private readonly userService: UserService
	) {}

	private async buildDTO(entity: OrderEntity): Promise<OrderDTO> {
		const shortUserDTO = await this.userService.getShortDTOByIdOrFail(entity.userId);
		return OrderMapper.toDTO(entity, shortUserDTO);
	}

	private async formDTO(entity?: OrderEntity | null): Promise<OrderDTO | null> {
		if (!entity) return null;
		return await this.buildDTO(entity);
	}

	private async formDTORequired(entity: OrderEntity): Promise<OrderDTO> {
		return await this.buildDTO(entity);
	}

	private async formOrderDTOs(entities: readonly OrderEntity[]): Promise<OrderDTO[]> {
		const uniqueUserIds = [
			...new Set(entities.map(entity => entity.userId).filter(Boolean)),
		];
		const shortUserDTOs = await this.userService.getShortDTOsByIds(uniqueUserIds);

		return OrderMapper.toDTOs(entities, shortUserDTOs);
	}

	async create(userId: string, data: OrderCreateInput): Promise<OrderDTO> {
		await this.userService.getByIdOrFail(userId);

		const createdEntity = await this.orderRepository.create(userId, data);

		return await this.formDTORequired(createdEntity);
	}

	async updateStatus(id: string, status: OrderStatus): Promise<OrderDTO> {
		const updatedEntity = await this.orderRepository.updateStatus(id, status);
		return await this.formDTORequired(updatedEntity);
	}

	async updatePaymentSessionId(id: string, paymentSessionId: string): Promise<OrderDTO> {
		const updatedEntity = await this.orderRepository.updatePaymentSessionId(id, paymentSessionId);
		return await this.formDTORequired(updatedEntity);
	}

	async getById(id: string): Promise<OrderDTO | null> {
		const entity = await this.orderRepository.findById(id);
		return await this.formDTO(entity);
	}

	async getByIdOrFail(id: string): Promise<OrderDTO> {
		const dto = await this.getById(id);

		if (!dto) throw new EntityNotFoundError("Order", { id });

		return dto;
	}

	async getByIdAndUser(id: string, userId: string): Promise<OrderDTO | null> {
		const entity = await this.orderRepository.findByIdAndUser(id, userId);
		return await this.formDTO(entity);
	}

	async getByIdAndUserOrFail(id: string, userId: string): Promise<OrderDTO> {
		const dto = await this.getByIdAndUser(id, userId);

		if (!dto) throw new EntityNotFoundError("Order", { id, userId });

		return dto;
	}

	async getByPaymentSessionId(sessionId: string): Promise<OrderDTO | null> {
		const entity = await this.orderRepository.findByPaymentSessionId(sessionId);
		return await this.formDTO(entity);
	}

	async getByPaymentSessionIdOrFail(sessionId: string): Promise<OrderDTO> {
		const dto = await this.getByPaymentSessionId(sessionId);

		if (!dto) throw new EntityNotFoundError("Order", { sessionId });

		return dto;
	}

	async getByOrderNumber(orderNumber: string): Promise<OrderDTO | null> {
		const entity = await this.orderRepository.findByOrderNumber(orderNumber);
		return await this.formDTO(entity);
	}

	async getByOrderNumberOrFail(orderNumber: string): Promise<OrderDTO> {
		const dto = await this.getByOrderNumber(orderNumber);

		if (!dto) throw new EntityNotFoundError("Order", { orderNumber });

		return dto;
	}

	async getAll(page: number = 1, limit: number = 10, filters: OrderFiltersInput = {}): Promise<OrderPaginationResultDTO> {
		const skip = (page - 1) * limit;

		const { results, total } = await this.orderRepository.findAndCount(filters, skip, limit);

		const pages = Math.ceil(total / limit);
		const dtos = await this.formOrderDTOs(results);

		return new OrderPaginationResultDTO(
			dtos,
			new PaginationMetadata(page, limit, total, pages)
		);
	}
}