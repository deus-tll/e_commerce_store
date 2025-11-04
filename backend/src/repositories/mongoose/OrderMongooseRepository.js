import Order from "../../models/mongoose/Order.js";

import {IOrderRepository} from "../../interfaces/repositories/IOrderRepository.js";
import {SalesSummaryDTO, DailySalesSummaryDTO, RepositoryPaginationResult} from "../../domain/index.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {ConflictError} from "../../errors/apiErrors.js";

export class OrderMongooseRepository extends IOrderRepository {
	async create(data) {
		const docData = {
			user: data.userId,
			totalAmount: data.totalAmount,
			paymentSessionId: data.paymentSessionId,

			products: data.products.map(item => ({
				product: item.productId,
				quantity: item.quantity,
				price: item.price,
				productName: item.productName,
				productMainImage: item.productMainImage
			}))
		};

		try {
			const createdDoc = await Order.create(docData);
			return MongooseAdapter.toOrderEntity(createdDoc);
		}
		catch (error) {
			const keyPattern = error['keyPattern'];

			if (error.code === 11000 && keyPattern.paymentSessionId)
			{
				throw new ConflictError("An order with this payment session ID already exists.");
			}

			throw error;
		}
	}

	async updateById(id, data) {
		const $set = data.toUpdateObject();

		if (Object.keys($set).length === 0) {
			return this.findById(id);
		}

		const updateOptions = { new: true, runValidators: true };

		const updatedDoc = await Order.findByIdAndUpdate(id, { $set }, updateOptions).lean();

		return MongooseAdapter.toOrderEntity(updatedDoc);
	}

	async findById(id, options = {}) {
		let query = Order.findById(id);

		if (options.populate) {
			query = query.populate(options.populate);
		}

		const foundDoc = await query.lean();
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