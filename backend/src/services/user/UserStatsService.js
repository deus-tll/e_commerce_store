import {IUserStatsService} from "../../interfaces/user/IUserStatsService.js";
import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {UserStatsDTO} from "../../domain/index.js";

/**
 * @augments IUserStatsService
 * @description Concrete implementation of IUserStatsService.
 */
export class UserStatsService extends IUserStatsService {
	/** @type {IUserRepository} */ #userRepository;

	/**
	 * @param {IUserRepository} userRepository
	 */
	constructor(userRepository) {
		super();
		this.#userRepository = userRepository;
	}

	async calculateStats() {
		const stats = await this.#userRepository.getGlobalStats();
		return new UserStatsDTO(stats);
	}
}