import { UserEntity, CreateUserDTO, UpdateUserDTO, RepositoryPaginationResult } from "../../domain/index.js";

/**
 * @interface IUserRepository
 * @description Contract for working with user data.
 */
export class IUserRepository {
	/**
	 * Creates and saves a new user entity.
	 * @param {CreateUserDTO} data - The data for the new user.
	 * @returns {Promise<UserEntity>} - The newly created user record.
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates a user entity by its ID.
	 * @param {string} id - The user ID.
	 * @param {UpdateUserDTO} data - The data for the update user.
	 * @param {object} [options] - Optional settings for the operation.
	 * @returns {Promise<UserEntity | null>} - The updated user record.
	 */
	async updateById(id, data, options) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a user entity by its ID.
	 * @param {string} id - The user ID.
	 * @returns {Promise<UserEntity | null>} - The deleted user record.
	 */
	async deleteById(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a user entity by its ID.
	 * @param {string} id - The user ID.
	 * @param {object} [options] - Query options (e.g., to include related data).
	 * @returns {Promise<UserEntity | null>} - The found user record.
	 */
	async findById(id, options) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a single user entity based on a query.
	 * @param {object} query - The filtering query.
	 * @param {object} [options] - Query options (e.g., to include related data).
	 * @returns {Promise<UserEntity | null>} - The found user record.
	 */
	async findOne(query, options) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds users and their total count for pagination purposes.
	 * @param {object} query - The filtering query.
	 * @param {number} skip - The number of documents to skip.
	 * @param {number} limit - The maximum number of documents to return.
	 * @param {object} [sort] - The sorting parameters.
	 * @returns {Promise<RepositoryPaginationResult<UserEntity>>} - The paginated results.
	 */
	async findAndCount(query, skip, limit, sort) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Counts the total number of documents matching the query.
	 * @param {object} query - The filtering query (e.g., { role: 'admin' }).
	 * @returns {Promise<number>} - The total number of documents found.
	 */
	async count(query) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a user by a valid verification token.
	 * @param {string} token - The verification token.
	 * @returns {Promise<UserEntity|null>} - The found user record.
	 */
	async findByValidVerificationToken(token) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a user by a valid password reset token.
	 * @param {string} token - The reset token.
	 * @returns {Promise<UserEntity|null>} - The found user record.
	 */
	async findByValidResetToken(token) {
		throw new Error("Method not implemented.");
	}
}