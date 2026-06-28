import {IOrderRepository} from "../order/IOrderRepository.js";
import {IUserRepository} from "../user/IUserRepository.js";
import {IProductRepository} from "../product/IProductRepository.js";
import {AnalyticsSummaryDTO, DailySalesDataDTO, FullAnalyticsResponseDTO} from "../types/analytics.js";

import {MS_PER_DAY} from "../../constants/time.js";
import {DateTime} from "../../utils/dateTime.js";

export class AnalyticsService {
	constructor(
		private readonly orderRepository: IOrderRepository,
		private readonly userRepository: IUserRepository,
		private readonly productRepository: IProductRepository
	) {}

	/**
	 * Retrieves core aggregated metrics (total users, products, sales, revenue).
	 */
	async getAnalyticsData(): Promise<AnalyticsSummaryDTO> {
		const [totalUsers, totalProducts] = await Promise.all([
			this.userRepository.count({}),
			this.productRepository.count({}),
		]);

		const salesData = await this.orderRepository.getSalesSummary();

		const { totalSales, totalRevenue } = salesData;

		return new AnalyticsSummaryDTO({
			users: totalUsers,
			products: totalProducts,
			totalSales,
			totalRevenue
		});
	}

	/**
	 * Retrieves daily sales and revenue data for a recent period.
	 * Fills in zero values for days with no sales.
	 */
	async getDailySalesData(): Promise<DailySalesDataDTO[]> {
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * MS_PER_DAY);

		const dailySalesData = await this.orderRepository.getDailySalesSummary(startDate, endDate);

		const filledData = DateTime.fillDateGaps(
			startDate,
			endDate,
			dailySalesData,
			'date',
			{ salesCount: 0, totalRevenue: 0 }
		);

		return filledData.map((data) => new DailySalesDataDTO({
			date: data.date,
			sales: data.salesCount,
			revenue: data.totalRevenue
		}));
	}

	/**
	 * Retrieves all available analytics data in a single response.
	 */
	async getFullAnalytics(): Promise<FullAnalyticsResponseDTO> {
		const analyticsData = await this.getAnalyticsData();
		const dailySalesData = await this.getDailySalesData();

		return new FullAnalyticsResponseDTO({
			analyticsData,
			dailySalesData
		});
	}
}