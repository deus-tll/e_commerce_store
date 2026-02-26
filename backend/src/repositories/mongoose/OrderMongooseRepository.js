import Order from "../../models/mongoose/Order.js";
import Counter from "../../models/mongoose/Counter.js";

import {IOrderRepository} from "../../interfaces/repositories/IOrderRepository.js";
import {SalesSummaryDTO, DailySalesSummaryDTO, RepositoryPaginationResult} from "../../domain/index.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {EntityAlreadyExistsError, EntityNotFoundError, SystemError} from "../../errors/index.js";
import {determineSort, toObjectId} from "./utils.js";

export class OrderMongooseRepository extends IOrderRepository {
	#buildMongooseQuery(query) {
		const mongooseQuery = {};

		if (query.userId) mongooseQuery.user = toObjectId(query.userId, "Order")
		if (query.status) mongooseQuery.status = query.status;

		return mongooseQuery;
	}

	async create(userId, data) {
		let newOrderNumber;

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

		const docData = {
			user: userId,
			totalAmount: data.totalAmount,
			paymentSessionId: data.paymentSessionId,
			orderNumber: newOrderNumber,

			products: data.products.map(item => ({
				product: item.id,
				quantity: item.quantity,
				price: item.price,
				name: item.name,
				image: item.image
			}))
		};

		try {
			const createdDoc = await Order.create(docData);
			return MongooseAdapter.toOrderEntity(createdDoc);
		}
		catch (error) {
			const keyPattern = error['keyPattern'];

			if (error.code === 11000 && keyPattern)
			{
				if (keyPattern.paymentSessionId) {
					throw new EntityAlreadyExistsError("Order", { paymentSessionId: data.paymentSessionId } );
				}
				if (keyPattern.orderNumber) {
					throw new SystemError("Order number conflict during save.");
				}
			}

			throw error;
		}
	}

	async updateStatus(id, status) {
		const updatedDoc = await Order.findByIdAndUpdate(
			id,
			{ $set: { status } },
			{ new: true }
		).lean();

		if (!updatedDoc) {
			throw new EntityNotFoundError("Order", { id });
		}

		return MongooseAdapter.toOrderEntity(updatedDoc);
	}

	async findById(id) {
		const foundDoc = await Order.findById(id).lean();
		return MongooseAdapter.toOrderEntity(foundDoc);
	}

	async findByIdAndUser(id, userId) {
		const foundDoc = await Order.findOne({ _id: id, user: userId }).lean();
		return foundDoc ? MongooseAdapter.toOrderEntity(foundDoc) : null;
	}

	async findByPaymentSessionId(sessionId) {
		const foundDoc = await Order.findOne({ paymentSessionId: sessionId }).lean();
		return MongooseAdapter.toOrderEntity(foundDoc);
	}

	async findByOrderNumber(orderNumber) {
		const foundDoc = await Order.findOne({ orderNumber }).lean();
		return MongooseAdapter.toOrderEntity(foundDoc);
	}

	async findAndCount(query, skip, limit, options = {}) {
		const mongooseQuery = this.#buildMongooseQuery(query);
		const sort = determineSort(options.sortBy, options.order);

		const result = await Order.aggregate([
			{ $match: mongooseQuery },
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

		const entities = foundDocs.map(doc => MongooseAdapter.toOrderEntity(doc));
		return new RepositoryPaginationResult(entities, total);
	}

	async getSalesSummary() {
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

	async getDailySalesSummary(startDate, endDate) {
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