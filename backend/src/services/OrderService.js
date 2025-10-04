import Order from "../models/mongoose/Order.js";
import {NotFoundError} from "../errors/apiErrors.js";

export class OrderService {
	async createOrder(userId, products, totalAmount, stripeSessionId) {
		const newOrder = new Order({
			user: userId,
			products: products.map((product) => ({
				product: product.id,
				quantity: product.quantity,
				price: product.price,
			})),
			totalAmount: totalAmount,
			stripeSessionId: stripeSessionId
		});

		return newOrder.save();
	}

	async findOrderByStripeSessionId(sessionId) {
		return Order.findOne({ stripeSessionId: sessionId });
	}

	async getOrderById(orderId) {
		const order = await Order.findById(orderId);
		if (!order) {
			throw new NotFoundError("Order not found");
		}
		return order;
	}

	async getSalesAggregation() {
		return Order.aggregate([
			{
				$group: {
					_id: null,
					totalSales: { $sum: 1 },
					totalRevenue: { $sum: "$totalAmount" },
				}
			}
		]);
	}

	async getDailySalesAggregation(startDate, endDate) {
		return Order.aggregate([
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
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" }
				}
			},
			{ $sort: { _id: 1 } }
		]);
	}
}