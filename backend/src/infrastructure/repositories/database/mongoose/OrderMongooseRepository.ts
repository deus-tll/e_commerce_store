import {MongoServerError} from "mongodb";
import {FilterQuery} from "mongoose";
import Order, {IOrderDoc} from "./models/Order.js";
import Counter from "./models/Counter.js";

import {IOrderRepository} from "../../../../application/order/IOrderRepository.js";
import {OrderAdapter} from "./adapters/OrderAdapter.js";

import {OrderEntity} from "../../../../entities/order/OrderEntity.js";
import {
	DailySalesSummaryDTO,
	OrderCreatePersistence,
	OrderFiltersPersistence,
	SalesSummaryDTO
} from "../../../../application/types/order.js";
import {RepositoryPaginationResult} from "../../../../application/types/shared.js";

import {EntityAlreadyExistsError, EntityNotFoundError, SystemError} from "../../../../errors/index.js";

import {OrderStatus} from "../../../../enums/application.js";

import {determineSort, toObjectId} from "./utils.js";

type OrderAggregationResult = {
	metadata: { total: number }[];
	data: IOrderDoc[];
}[];

export class OrderMongooseRepository extends IOrderRepository {
	private toEntityOrThrow(doc?: IOrderDoc | null, criteria: any = {}): OrderEntity {
		const entity = OrderAdapter.toEntity(doc);

		if (!entity) throw new EntityNotFoundError("Order", criteria);

		return entity;
	}

	private buildQuery(filters: OrderFiltersPersistence): FilterQuery<IOrderDoc> {
		const { userId, status } = filters;

		return {
			...(userId && { user: toObjectId(userId, "User") }),
			...(status && { status }),
		};
	}

	async create(userId: string, data: OrderCreatePersistence): Promise<OrderEntity> {
		let newOrderNumber: string;

		try {
			const counter = await Counter.findByIdAndUpdate(
				{ _id: "orderNumber"},
				{ $inc: { seq: 1 }},
				{ new: true, upsert: true }
			);

			newOrderNumber = counter.seq.toString().padStart(6, '0');
		}
		catch (error) {
			throw new SystemError("Failed to generate unique order number.");
		}

		const { products, ...rest  } = data;

		const docData = {
			...rest,
			user: userId,
			orderNumber: newOrderNumber,
			products: products.map(item => {
				const { id: itemId, ...restOfItem } = item;

				return {
					...restOfItem,
					product: itemId,
				}
			})
		};

		try {
			const createdDoc = await Order.create(docData);
			return OrderAdapter.toEntityRequired(createdDoc);
		}
		catch (error) {
			if (error instanceof MongoServerError && error.code === 11000)
			{
				const keyPattern = error.keyPattern as Record<string, unknown> | undefined;

				if (keyPattern?.paymentSessionId) {
					throw new EntityAlreadyExistsError("Order", { paymentSessionId: data.paymentSessionId } );
				}

				if (keyPattern?.orderNumber) {
					throw new SystemError("Order number conflict during save.");
				}
			}

			throw error;
		}
	}

	async updateStatus(id: string, status: OrderStatus): Promise<OrderEntity> {
		const updatedDoc = await Order.findByIdAndUpdate(
			id,
			{ $set: { status } },
			{ new: true }
		).lean();

		return this.toEntityOrThrow(updatedDoc, { id });
	}

	async updatePaymentSessionId(id: string, paymentSessionId: string): Promise<OrderEntity> {
		const updatedDoc = await Order.findByIdAndUpdate(
			id,
			{ $set: { paymentSessionId } },
			{ new: true }
		).lean();

		return this.toEntityOrThrow(updatedDoc, { id });
	}

	async findById(id: string): Promise<OrderEntity | null> {
		const foundDoc = await Order.findById(id).lean();
		return OrderAdapter.toEntity(foundDoc);
	}

	async findByIdAndUser(id: string, userId: string): Promise<OrderEntity | null> {
		const foundDoc = await Order.findOne({ _id: id, user: userId }).lean();
		return OrderAdapter.toEntity(foundDoc);
	}

	async findByPaymentSessionId(sessionId: string): Promise<OrderEntity | null> {
		const foundDoc = await Order.findOne({ paymentSessionId: sessionId }).lean();
		return OrderAdapter.toEntity(foundDoc);
	}

	async findByOrderNumber(orderNumber: string): Promise<OrderEntity | null> {
		const foundDoc = await Order.findOne({ orderNumber }).lean();
		return OrderAdapter.toEntity(foundDoc);
	}

	async findAndCount(filters: OrderFiltersPersistence, skip: number, limit: number): Promise<RepositoryPaginationResult<OrderEntity>> {
		const { sortBy = "createdAt", order = "desc", ...queryFilters } = filters;

		const query = this.buildQuery(queryFilters);
		const sort = determineSort(sortBy, order);

		const result: OrderAggregationResult = await Order.aggregate([
			{ $match: query },
			{ $sort: sort },
			{
				$facet: {
					metadata: [{ $count: "total" }],
					data: [{ $skip: skip }, { $limit: limit }]
				}
			}
		]);

		const total = result[0].metadata[0]?.total || 0;
		const foundDocs = result[0].data;

		const entities = foundDocs.map(doc => OrderAdapter.toEntityRequired(doc));
		return new RepositoryPaginationResult(entities, total);
	}

	async hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
		return Boolean(await Order.exists({
			user: userId,
			"products.product": productId,
			status: OrderStatus.DELIVERED
		}));
	}

	async getSalesSummary(): Promise<SalesSummaryDTO> {
		const result = await Order.aggregate([
			{
				$group: {
					_id: null,
					totalSales: { $sum: 1 },
					totalRevenue: { $sum: "$totalAmount" },
				}
			},
			{
				$project: {
					_id: 0,
					totalSales: 1,
					totalRevenue: 1,
				}
			}
		]);

		const summary = result.length > 0 ? result[0] : { totalSales: 0, totalRevenue: 0 };

		return new SalesSummaryDTO(summary.totalSales, summary.totalRevenue);
	}

	async getDailySalesSummary(startDate: Date, endDate: Date): Promise<DailySalesSummaryDTO[]> {
		const results = await Order.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate
					},
				}
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					salesCount: { $sum: 1 },
					totalRevenue: { $sum: "$totalAmount" },
				}
			},
			{
				$project: {
					_id: 0,
					date: "$_id",
					salesCount: 1,
					totalRevenue: 1,
				}
			},
			{
				$sort: { date: 1 }
			}
		]);

		return results.map(data => new DailySalesSummaryDTO(data));
	}
}