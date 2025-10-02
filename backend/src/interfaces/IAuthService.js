/**
 * @typedef {object} TokensResponse
 * @property {string} accessToken
 * @property {string} refreshToken
 */

/**
 * @typedef {object} UserWithTokens
 * @property {import('./user/IUserService.js').UserDTO} user
 * @property {TokensResponse} tokens
 */

/**
 * @typedef {object} ValidateTokenResult
 * @property {string} userId
 * @property {import('./user/IUserRepository.js').UserEntity} user
 */

/**
 * @interface IAuthService
 * @description Contract for all authentication, token management, and profile operations.
 */
export class IAuthService {
	/**
	 * Handles user registration, token generation, and sending verification email.
	 * @param {string} name
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<UserWithTokens>}
	 */
	async signup(name, email, password) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Handles user login, password check, token generation, and last login update.
	 * @param {string} email
	 * @param {string} password
	 * @returns {Promise<UserWithTokens>}
	 */
	async login(email, password) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Invalidates the provided refresh token.
	 * @param {string} [refreshToken]
	 * @returns {Promise<void>}
	 */
	async logout(refreshToken) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Fetches the user's profile data (DTO) by ID.
	 * @param {string} userId
	 * @returns {Promise<import('./user/IUserService.js').UserDTO>}
	 */
	async getProfile(userId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Validates the access token and checks if the user still exists.
	 * @param {string} token - The access token.
	 * @returns {Promise<ValidateTokenResult>}
	 */
	async validateAccessToken(token) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Generates a new access token using a valid refresh token.
	 * @param {string} refreshToken
	 * @returns {Promise<{accessToken: string}>}
	 */
	async refreshAccessToken(refreshToken) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Verifies the user's email using the provided code.
	 * @param {string} code - The verification token.
	 * @returns {Promise<UserWithTokens>}
	 */
	async verifyEmail(code) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Resends the email verification code.
	 * @param {string} userId
	 * @returns {Promise<{message: string}>}
	 */
	async resendVerificationEmail(userId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Initiates the password reset process by generating a token and sending an email.
	 * @param {string} email
	 * @returns {Promise<{message: string}>}
	 */
	async forgotPassword(email) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Resets the password using the reset token.
	 * @param {string} token - The reset password token.
	 * @param {string} password - The new password.
	 * @returns {Promise<UserWithTokens>}
	 */
	async resetPassword(token, password) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Invalidates all refresh tokens (sessions) for a specific user ID.
	 * @param {string} userId
	 * @returns {Promise<void>}
	 */
	async invalidateAllSessions(userId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Allows a logged-in user to change their password.
	 * @param {string} userId
	 * @param {string} currentPassword
	 * @param {string} newPassword
	 * @returns {Promise<{message: string}>}
	 */
	async changePassword(userId, currentPassword, newPassword) {
		throw new Error("Method not implemented.");
	}
}