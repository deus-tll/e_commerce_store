import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import {MS_PER_DAY} from "../utils/timeConstants.js";


export class AnalyticsService {
	#getDatesInRange(startDate, endDate) {
		const dates = [];
		let currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			dates.push(currentDate.toISOString().split("T")[0]);
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dates;
	}

	async getAnalyticsData() {
		const totalUsers = await User.countDocuments();
		const totalProducts = await Product.countDocuments();

		const salesData = await Order.aggregate([
			{
				$group: {
					_id: null,
					totalSales: { $sum: 1 },
					totalRevenue: { $sum: "$totalAmount" },
				}
			}
		]);

		const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

		return {
			users: totalUsers,
			products: totalProducts,
			totalSales,
			totalRevenue
		};
	}

	async getDailySalesData() {
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * MS_PER_DAY);

		const dailySalesData = await Order.aggregate([
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

		const dateArray = this.#getDatesInRange(startDate, endDate);

		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date);

			return {
				date,
				sales: foundData?.sales || 0,
				revenue: foundData?.revenue || 0
			};
		});
	}

	async getFullAnalytics() {
		const analyticsData = await this.getAnalyticsData();
		const dailySalesData = await this.getDailySalesData();

		return {
			analyticsData,
			dailySalesData
		};
	}
}