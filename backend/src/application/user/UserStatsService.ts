import {IUserRepository} from "./IUserRepository.js";

export class UserStatsService {
	constructor(
		private readonly userRepository: IUserRepository
	) {}

	async calculateStats() {
		return await this.userRepository.getGlobalStats();
	}
}