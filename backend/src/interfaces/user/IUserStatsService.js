import {UserStatsDTO} from "../../domain/index.js";

/**
 * @interface IUserStatsService
 * @description Defines the contract for calculating and aggregating user statistics.
 */
export class IUserStatsService {
	/**
	 * Calculates and returns aggregated user statistics.
	 * @returns {Promise<UserStatsDTO>} - The aggregated user statistics DTO.
	 */
	async calculateStats() { throw new Error("Method not implemented."); }
}