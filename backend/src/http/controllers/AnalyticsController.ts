import {Request, Response} from "express";
import {AnalyticsService} from "../../application/analytics/AnalyticsService.js";

export class AnalyticsController {
	constructor(
		private readonly analyticsService: AnalyticsService
	) {}

	getAnalytics = async (_: Request, res: Response): Promise<Response> => {
		const analyticsData = await this.analyticsService.getFullAnalytics();
		return res.status(200).json(analyticsData);
	};
}