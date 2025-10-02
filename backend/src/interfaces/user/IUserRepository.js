/**
 * @typedef {object} UserEntity - Placeholder for the core User entity type.
 */

/**
 * @typedef {object} PaginationResult
 * @property {Array<UserEntity>} users - Array of found users.
 * @property {number} total - Total number of users matching the query.
 */

export {};

/**
 * @interface IUserRepository
 * @description Contract for working with user data.
 */
export class IUserRepository {
	/**
	 * Creates and saves a new user entity.
	 * @param {object} data - Data for the new user.
	 * @returns {Promise<UserEntity>}
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates a user entity by its ID.
	 * @param {string} id - The ID of the user to update.
	 * @param {object} data - The data to update.
	 * @param {object} [options] - Optional settings for the operation.
	 * @returns {Promise<UserEntity | null>}
	 */
	async updateById(id, data, options) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a user entity by its ID.
	 * @param {string} id - The ID of the user to delete.
	 * @returns {Promise<UserEntity | null>}
	 */
	async deleteById(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a user entity by its ID.
	 * @param {string} id - The user ID.
	 * @param {object} [options] - Query options (e.g., to include related data).
	 * @returns {Promise<UserEntity | null>}
	 */
	async findById(id, options) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a single user entity based on a query.
	 * @param {object} query - Filtering query.
	 * @param {object} [options] - Query options (e.g., to include related data).
	 * @returns {Promise<UserEntity | null>}
	 */
	async findOne(query, options) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds users and their total count for pagination purposes.
	 * @param {object} query - Filtering query.
	 * @param {number} skip - The number of documents to skip.
	 * @param {number} limit - The maximum number of documents to return.
	 * @param {object} [sort] - Sorting parameters.
	 * @returns {Promise<PaginationResult>}
	 */
	async findAndCount(query, skip, limit, sort) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Compares a plaintext password with the user entity's stored password hash.
	 * @param {UserEntity} entity - The user entity object retrieved by the repository.
	 * @param {string} password - The plaintext password to compare.
	 * @returns {Promise<boolean>} - True if the passwords match.
	 */
	async comparePassword(entity, password) {
		throw new Error("Method not implemented.");
	}
}