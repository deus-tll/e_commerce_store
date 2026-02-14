import {
	UserEntity,
	UserDTO,
	CreateUserDTO,
	UpdateUserDTO,
	UserPaginationResultDTO
} from "../../domain/index.js";

/**
 * @interface IUserService
 * @description Agnostic business logic layer for user operations.
 */
export class IUserService {
	/**
	 * Creates a new user in the system.
	 * @param {CreateUserDTO} data - The data for the new user.
	 * @returns {Promise<UserDTO>} - The newly created user DTO.
	 */
	async create(data) { throw new Error("Method not implemented."); }

	/**
	 * Updates an existing user's public fields.
	 * @param {string} id - The user ID.
	 * @param {UpdateUserDTO} data - The data for the update user.
	 * @param {object} requester - User that is requesting update.
	 * @returns {Promise<UserDTO>} - The updated user DTO.
	 */
	async update(id, data, requester) { throw new Error("Method not implemented."); }

	/**
	 * Updates the user's last login timestamp.
	 * @param {string} id - The user ID.
	 * @returns {Promise<UserDTO | null>} - The updated user DTO.
	 */
	async updateLastLogin(id) { throw new Error("Method not implemented."); }

	/**
	 * Allows a logged-in user to change their password.
	 * @param {UserEntity} entity - The user entity record.
	 * @param {string} newPassword - The new password.
	 * @returns {Promise<UserDTO>} - The updated user DTO.
	 */
	async changePassword(entity, newPassword) { throw new Error("Method not implemented."); }

	/**
	 * Deletes a user by ID.
	 * @param {string} id - The user ID.
	 * @returns {Promise<UserDTO>} - The deleted user DTO.
	 */
	async delete(id) { throw new Error("Method not implemented."); }

	/**
	 * Fetches a list of users with pagination and filtering.
	 * @param {number} [page] - The page number.
	 * @param {number} [limit] - The maximum number of documents per page.
	 * @param {object} [filters] - The filtering query object.
	 * @returns {Promise<UserPaginationResultDTO>} - The paginated list of users.
	 */
	async getAll(page, limit, filters) { throw new Error("Method not implemented."); }

	/**
	 * Finds a user by ID, returning the internal Entity object.
	 * @param {string} id - The user ID.
	 * @param {object} [options] - Query options.
	 * @returns {Promise<UserEntity | null>} - The found user entity record.
	 */
	async getEntityById(id, options) { throw new Error("Method not implemented."); }

	/**
	 * Finds a user by ID, returning the internal Entity object or throwing if not found.
	 * @param {string} id - The user ID.
	 * @param {object} [options] - Query options.
	 * @returns {Promise<UserEntity>} - The found user entity record.
	 */
	async getEntityByIdOrFail(id, options) { throw new Error("Method not implemented."); }

	/**
	 * Finds a user by ID.
	 * @param {string} id - The user ID.
	 * @param {object} [options] - Query options.
	 * @returns {Promise<UserDTO | null>} - The found user DTO.
	 */
	async getById(id, options) { throw new Error("Method not implemented."); }

	/**
	 * Finds a user by ID and returns short version.
	 * @param {string} id - The user ID.
	 * @returns {Promise<ShortUserDTO | null>} - The found short user DTO.
	 */
	async getShortDTOById(id) { throw new Error("Method not implemented."); }

	/**
	 * Finds a user by ID, throws if not found.
	 * @param {string} id - The user ID.
	 * @param {object} [options] - Query options.
	 * @returns {Promise<UserDTO>} - The found user DTO.
	 */
	async getByIdOrFail(id, options) { throw new Error("Method not implemented."); }

	/**
	 * Finds a user by email, returning the internal Entity object.
	 * @param {string} email - The user email.
	 * @param {object} [options] - Query options.
	 * @returns {Promise<UserEntity | null>} - The found user entity record.
	 */
	async getEntityByEmail(email, options) { throw new Error("Method not implemented."); }

	/**
	 * Finds a user by email, returning the internal Entity object or throwing if not found.
	 * @param {string} email - The user email.
	 * @param {object} [options] - Query options.
	 * @returns {Promise<UserEntity>} - The found user entity record.
	 */
	async getEntityByEmailOrFail(email, options) { throw new Error("Method not implemented."); }

	/**
	 * Finds a user by email.
	 * @param {string} email - The user email.
	 * @param {object} [options] - Query options.
	 * @returns {Promise<UserDTO | null>} - The found user DTO.
	 */
	async getByEmail(email, options) { throw new Error("Method not implemented."); }

	/**
	 * Finds a user by email, throws if not found.
	 * @param {string} email - The user email.
	 * @param {object} [options] - Query options.
	 * @returns {Promise<UserDTO>} - The found user DTO.
	 */
	async getByEmailOrFail(email, options) { throw new Error("Method not implemented."); }

	/**
	 * Finds a minimal set of user details for an array of IDs.
	 * @param {string[]} ids - Array of user IDs.
	 * @returns {Promise<ShortUserDTO[]>} - A list of short user DTOs.
	 */
	async getShortDTOsByIds(ids) { throw new Error("Method not implemented."); }

	/**
	 * Checks if a user exists by email.
	 * @param {string} email - The user email.
	 * @returns {Promise<boolean>}
	 */
	async existsByEmail(email) { throw new Error("Method not implemented."); }
}