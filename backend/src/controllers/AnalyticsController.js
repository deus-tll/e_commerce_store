import {IAnalyticsService} from "../interfaces/analytics/IAnalyticsService.js";

/**
 * Handles incoming HTTP requests for retrieving various system analytics and statistics.
 * This controller requires authentication and authorization (e.g., admin role).
 */
export class AnalyticsController {
	/** @type {IAnalyticsService} */ #analyticsService;

	/**
	 * @param {IAnalyticsService} analyticsService
	 */
	constructor(analyticsService) {
		this.#analyticsService = analyticsService;
	}

	/**
	 * Retrieves the complete set of analytics data, including summaries and time-series data.
	 * This endpoint requires an administrative role.
	 * @param {object} req - Express request object.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a FullAnalyticsResponseDTO.
	 */
	getAnalytics = async (req, res, next) => {
		try {
			const analyticsData = await this.#analyticsService.getFullAnalytics();

			return res.status(200).json(analyticsData);
		} catch (error) {
			next(error);
		}
	};
}