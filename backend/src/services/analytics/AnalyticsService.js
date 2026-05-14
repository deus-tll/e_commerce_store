import {IAnalyticsService} from "../../interfaces/analytics/IAnalyticsService.js";
import {IOrderRepository} from "../../interfaces/repositories/IOrderRepository.js";
import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {IProductRepository} from "../../interfaces/repositories/IProductRepository.js";
import {AnalyticsSummaryDTO, DailySalesDataDTO, FullAnalyticsResponseDTO} from "../../domain/index.js";

import {MS_PER_DAY} from "../../constants/time.js";
import {DateTime} from "../../utils/dateTime.ts";

export class AnalyticsService extends IAnalyticsService {
	/** @type {IOrderRepository} */ #orderRepository;
	/** @type {IUserRepository} */ #userRepository;
	/** @type {IProductRepository} */ #productRepository;

	/**
	 * @param {IOrderRepository} orderRepository
	 * @param {IUserRepository} userRepository
	 * @param {IProductRepository} productRepository
	 */
	constructor(orderRepository, userRepository, productRepository) {
		super();
		this.#orderRepository = orderRepository;
		this.#userRepository = userRepository;
		this.#productRepository = productRepository;
	}

	async getAnalyticsData() {
		const [totalUsers, totalProducts] = await Promise.all([
			this.#userRepository.count({}),
			this.#productRepository.count({}),
		]);

		const salesData = await this.#orderRepository.getSalesSummary();

		const { totalSales, totalRevenue } = salesData;

		return new AnalyticsSummaryDTO({
			users: totalUsers,
			products: totalProducts,
			totalSales,
			totalRevenue
		});
	}

	async getDailySalesData() {
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * MS_PER_DAY);

		const dailySalesData = await this.#orderRepository.getDailySalesSummary(startDate, endDate);

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

	async getFullAnalytics() {
		const analyticsData = await this.getAnalyticsData();
		const dailySalesData = await this.getDailySalesData();

		return new FullAnalyticsResponseDTO({
			analyticsData,
			dailySalesData
		});
	}
}