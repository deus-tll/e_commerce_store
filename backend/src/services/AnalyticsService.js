import {MS_PER_DAY} from "../utils/timeConstants.js";
import {OrderService} from "./OrderService.js";
import {ProductService} from "./ProductService.js";
import {UserService} from "./UserService.js";
import {UserMongooseRepository} from "../repositories/mongoose/UserMongooseRepository.js";

export class AnalyticsService {
	constructor() {
		this.orderService = new OrderService();
		this.userService = new UserService(new UserMongooseRepository());
		this.productService = new ProductService();
	}

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
		const { usersPagination } = await this.userService.getAll(1, 1);
		const { productsPagination } = await this.productService.getProducts(1, 1);

		const totalUsers = usersPagination.total;
		const totalProducts = productsPagination.total;

		const salesData = await this.orderService.getSalesAggregation();

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

		const dailySalesData = await this.orderService.getDailySalesAggregation(startDate, endDate);

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