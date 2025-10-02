/**
 * @typedef {object} UserEntity - Placeholder for the core User entity type.
 */

/**
 * @typedef {object} PaginationResult
 * @property {Array<UserEntity>} users - Array of found users.
 * @property {number} total - Total number of users matching the query.
 */

/**
 * @typedef {object} UserData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} [role]
 * @property {boolean} [isVerified]
 */

/**
 * @typedef {object} UserDTO
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {boolean} isVerified
 * @property {Date} lastLogin
 * @property {Date} createdAt
 */

export class IUserService {
	/**
	 * Converts a User entity object to a clean Data Transfer Object (DTO).
	 * @param {UserEntity} entity
	 * @returns {UserDTO}
	 */
	toDTO(entity) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Creates a new user in the system.
	 * @param {UserData} data
	 * @returns {Promise<UserEntity>}
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates an existing user's public fields.
	 * @param {string} id
	 * @param {object} data
	 * @returns {Promise<UserEntity>}
	 */
	async update(id, data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates the user's last login timestamp.
	 * @param {string} id
	 * @returns {Promise<UserEntity>}
	 */
	async updateLastLogin(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Sets the verification token for the user.
	 * @param {string} id
	 * @param {string} token
	 * @param {Date} expiresAt
	 * @returns {Promise<UserEntity | null>}
	 */
	async setVerificationToken(id, token, expiresAt) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Verifies the user's email using the provided token.
	 * @param {string} token
	 * @returns {Promise<UserEntity>}
	 */
	async verify(token) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Sets the reset password token for the user.
	 * @param {string} id
	 * @param {string} token
	 * @param {Date} expiresAt
	 * @returns {Promise<UserEntity | null>}
	 */
	async setResetPasswordToken(id, token, expiresAt) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Resets the user's password using the reset token.
	 * @param {string} token
	 * @param {string} newPassword
	 * @returns {Promise<UserEntity>}
	 */
	async resetPassword(token, newPassword) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Allows a logged-in user to change their password.
	 * @param {UserEntity} entity - The user entity object.
	 * @param {string} newPassword
	 * @returns {Promise<UserEntity>}
	 */
	async changePassword(entity, newPassword) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a user by ID.
	 * @param {string} id
	 * @returns {Promise<UserEntity>}
	 */
	async delete(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Fetches a list of users with pagination and filtering.
	 * @param {number} [page]
	 * @param {number} [limit]
	 * @param {object} [filters]
	 * @returns {Promise<object>}
	 */
	async getAll(page, limit, filters) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a user by ID.
	 * @param {string} id
	 * @param {object} [options]
	 * @returns {Promise<UserEntity | null>}
	 */
	async getById(id, options) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a user by email.
	 * @param {string} email
	 * @param {object} [options]
	 * @returns {Promise<UserEntity | null>}
	 */
	async getByEmail(email, options) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Checks if a user exists by email.
	 * @param {string} email
	 * @returns {Promise<boolean>}
	 */
	async existsByEmail(email) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Compares a plaintext password with the user entity's stored password hash.
	 * @param {UserEntity} entity - The user entity object retrieved from the repository.
	 * @param {string} password - The plaintext password.
	 * @returns {Promise<boolean>} - True if passwords match.
	 */
	async comparePassword(entity, password) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds an admin user by email, or creates one if it doesn't exist.
	 * @param {UserData} data
	 * @returns {Promise<UserEntity | null>}
	 */
	async findOrCreateAdmin(data) {
		throw new Error("Method not implemented.");
	}
}