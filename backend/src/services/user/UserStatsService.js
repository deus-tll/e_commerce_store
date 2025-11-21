import {IUserStatsService} from "../../interfaces/user/IUserStatsService.js";
import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {UserStatsDTO} from "../../domain/index.js";
import {UserRoles} from "../../constants/app.js";

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
		const [total, verified, admins] = await Promise.all([
			this.#userRepository.count({}),
			this.#userRepository.count({ isVerified: true }),
			this.#userRepository.count({ role: UserRoles.ADMIN }),
		]);

		const unverified = total - verified;
		const customers = total - admins;

		const stats = {
			total,
			verified,
			unverified,
			admins,
			customers
		};

		return new UserStatsDTO(stats);
	}
}