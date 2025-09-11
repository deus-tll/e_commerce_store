import {AnalyticsService} from "../services/AnalyticsService.js";

export class AnalyticsController {
	constructor() {
		this.analyticsService = new AnalyticsService();
	}

	getAnalytics = async (req, res, next) => {
		try {
			const analyticsData = await this.analyticsService.getFullAnalytics();
			res.status(200).json(analyticsData);
		} catch (error) {
			next(error);
		}
	};
}