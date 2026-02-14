import Order from "../../models/mongoose/Order.js";
import Counter from "../../models/mongoose/Counter.js";

import {IOrderRepository} from "../../interfaces/repositories/IOrderRepository.js";
import {SalesSummaryDTO, DailySalesSummaryDTO, RepositoryPaginationResult} from "../../domain/index.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {ConflictError, InternalServerError} from "../../errors/apiErrors.js";

export class OrderMongooseRepository extends IOrderRepository {
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
			throw new InternalServerError("Failed to generate unique order number.");
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
					throw new ConflictError("An order with this payment session ID already exists.");
				}
				if (keyPattern.orderNumber) {
					throw new InternalServerError("Order number conflict during save.");
				}
			}

			throw error;
		}
	}

	async findById(id) {
		const foundDoc = await Order.findById(id).lean();
		return MongooseAdapter.toOrderEntity(foundDoc);
	}

	async findByPaymentSessionId(sessionId) {
		const foundDoc = await Order.findOne({ paymentSessionId: sessionId }).lean();
		return MongooseAdapter.toOrderEntity(foundDoc);
	}

	async findAndCountByUser(userId, skip, limit) {
		const query = { user: userId };

		const [foundDocs, total] = await Promise.all([
			Order.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			Order.countDocuments(query),
		]);

		const orderEntities = foundDocs.map(doc => MongooseAdapter.toOrderEntity(doc));

		return new RepositoryPaginationResult(orderEntities, total);
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