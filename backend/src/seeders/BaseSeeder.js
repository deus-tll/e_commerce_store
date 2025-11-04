/**
 * The base class for all application seeders.
 * This class is intended to be extended, not instantiated directly.
 */
export class BaseSeeder {

	constructor() {
		if (new.target === BaseSeeder) {
			throw new Error("Cannot instantiate abstract BaseSeeder directly.");
		}
	}

	/**
	 * Executes the seeding logic for a specific set of data.
	 * This method MUST be implemented by all derived seeder classes.
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async seed() {
		throw new Error("Method must be implemented.");
	}
}