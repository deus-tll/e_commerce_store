/**
 * Agnostic DTO for core aggregated analytics data.
 */
export class AnalyticsSummaryDTO {
	/** @type {number} */ users;
	/** @type {number} */ products;
	/** @type {number} */ totalSales;
	/** @type {number} */ totalRevenue;

	constructor(data) {
		this.users = data.users;
		this.products = data.products;
		this.totalSales = data.totalSales;
		this.totalRevenue = data.totalRevenue;
	}
}

/**
 * Agnostic DTO for daily sales and revenue data points.
 */
export class DailySalesDataDTO {
	/** @type {string} */ date;
	/** @type {number} */ sales;
	/** @type {number} */ revenue;

	constructor(data) {
		this.date = data.date;
		this.sales = data.sales;
		this.revenue = data.revenue;
	}
}

/**
 * Agnostic DTO for the complete analytics dashboard response.
 */
export class FullAnalyticsResponseDTO {
	/** @type {AnalyticsSummaryDTO} */ analyticsData;
	/** @type {DailySalesDataDTO[]} */ dailySalesData;

	constructor({ analyticsData, dailySalesData }) {
		this.analyticsData = analyticsData;
		this.dailySalesData = dailySalesData;
	}
}