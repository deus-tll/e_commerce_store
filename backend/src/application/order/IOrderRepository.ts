import {OrderEntity} from "../../entities/order/OrderEntity.js";
import {
	DailySalesSummaryDTO,
	OrderCreatePersistence,
	OrderFiltersPersistence,
	SalesSummaryDTO
} from "../types/order.js";
import {RepositoryPaginationResult} from "../types/shared.js";

import {OrderStatus} from "../../enums/application.js";

export abstract class IOrderRepository {
	abstract create(userId: string, data: OrderCreatePersistence): Promise<OrderEntity>;
	abstract updateStatus(id: string, status: OrderStatus): Promise<OrderEntity>;
	abstract updatePaymentSessionId(id: string, paymentSessionId: string): Promise<OrderEntity>;
	abstract findById(id: string): Promise<OrderEntity | null>;
	abstract findByIdAndUser(id: string, userId: string): Promise<OrderEntity | null>;
	abstract findByPaymentSessionId(sessionId: string): Promise<OrderEntity | null>;
	abstract findByOrderNumber(orderNumber: string): Promise<OrderEntity | null>;
	abstract findAndCount(
		filters: OrderFiltersPersistence,
		skip: number,
		limit: number
	): Promise<RepositoryPaginationResult<OrderEntity>>;
	abstract hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean>;
	abstract getSalesSummary(): Promise<SalesSummaryDTO>;
	abstract getDailySalesSummary(startDate: Date, endDate: Date): Promise<DailySalesSummaryDTO[]>;
}