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

	private async formOrderDTO(entity: OrderEntity): Promise<OrderDTO> {
		const shortUserDTO = await this.userService.getShortDTOById(entity.userId);
		return OrderMapper.toDTO(entity, shortUserDTO);
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

		const createdOrder = await this.orderRepository.create(userId, data);

		return await this.formOrderDTO(createdOrder);
	}

	async updateStatus(id: string, status: OrderStatus): Promise<OrderDTO> {
		const updatedEntity = await this.orderRepository.updateStatus(id, status);
		return await this.formOrderDTO(updatedEntity);
	}

	async updatePaymentSessionId(id: string, paymentSessionId: string): Promise<OrderDTO> {
		const updatedEntity = await this.orderRepository.updatePaymentSessionId(id, paymentSessionId);
		return await this.formOrderDTO(updatedEntity);
	}

	async getById(id: string): Promise<OrderDTO | null> {
		const orderEntity = await this.orderRepository.findById(id);

		if (!orderEntity) return null;

		return await this.formOrderDTO(orderEntity);
	}

	async getByIdOrFail(id: string): Promise<OrderDTO> {
		const orderDTO = await this.getById(id);

		if (!orderDTO) throw new EntityNotFoundError("Order", { id });

		return orderDTO;
	}

	async getByIdAndUser(id: string, userId: string): Promise<OrderDTO | null> {
		const orderEntity = await this.orderRepository.findByIdAndUser(id, userId);
		return await this.formOrderDTO(orderEntity);
	}

	async getByIdAndUserOrFail(id: string, userId: string): Promise<OrderDTO> {
		const orderDTO = await this.getByIdAndUser(id, userId);

		if (!orderDTO) throw new EntityNotFoundError("Order", { id, userId });

		return orderDTO;
	}

	async getByPaymentSessionId(sessionId: string): Promise<OrderDTO | null> {
		const orderEntity = await this.orderRepository.findByPaymentSessionId(sessionId);

		if (!orderEntity) return null;

		return await this.formOrderDTO(orderEntity);
	}

	async getByPaymentSessionIdOrFail(sessionId: string): Promise<OrderDTO> {
		const orderDTO = await this.getByPaymentSessionId(sessionId);

		if (!orderDTO) throw new EntityNotFoundError("Order", { sessionId });

		return orderDTO;
	}

	async getByOrderNumber(orderNumber: string): Promise<OrderDTO | null> {
		const orderEntity = await this.orderRepository.findByOrderNumber(orderNumber);

		if (!orderEntity) return null;

		return await this.formOrderDTO(orderEntity);
	}

	async getByOrderNumberOrFail(orderNumber: string): Promise<OrderDTO> {
		const orderDTO = await this.getByOrderNumber(orderNumber);

		if (!orderDTO) throw new EntityNotFoundError("Order", { orderNumber });

		return orderDTO;
	}

	async getAll(page: number = 1, limit: number = 10, filters: OrderFiltersInput = {}): Promise<OrderPaginationResultDTO> {
		const skip = (page - 1) * limit;

		const { results, total } = await this.orderRepository.findAndCount(filters, skip, limit);

		const pages = Math.ceil(total / limit);
		const orderDTOs = await this.formOrderDTOs(results);

		return new OrderPaginationResultDTO(
			orderDTOs,
			new PaginationMetadata(page, limit, total, pages)
		);
	}
}