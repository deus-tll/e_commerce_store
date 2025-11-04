import {AnalyticsSummaryDTO, DailySalesDataDTO, FullAnalyticsResponseDTO} from "../../domain/index.js";

/**
 * @interface IAnalyticsService
 * @description Contract for retrieving aggregated business and sales metrics.
 */
export class IAnalyticsService {
	/**
	 * Retrieves core aggregated metrics (total users, products, sales, revenue).
	 * @returns {Promise<AnalyticsSummaryDTO>} - The summary DTO with core business metrics.
	 */
	async getAnalyticsData() { throw new Error("Method not implemented."); }

	/**
	 * Retrieves daily sales and revenue data for a recent period.
	 * Fills in zero values for days with no sales.
	 * @returns {Promise<DailySalesDataDTO[]>} - An array of daily sales data DTOs.
	 */
	async getDailySalesData() { throw new Error("Method not implemented."); }

	/**
	 * Retrieves all available analytics data in a single response.
	 * @returns {Promise<FullAnalyticsResponseDTO>} - The comprehensive analytics response DTO.
	 */
	async getFullAnalytics() { throw new Error("Method not implemented."); }
}