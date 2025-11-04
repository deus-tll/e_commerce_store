import {UserWithTokensDTO, ValidateTokenDTO, UserDTO} from "../../domain/index.js";

/**
 * @interface ISessionAuthService
 * @description Contract for managing active user sessions and tokens.
 */
export class ISessionAuthService {
	/**
	 * Handles user login, password check, token generation, and last login update.
	 * @param {string} email - The user's email.
	 * @param {string} password - The user's password.
	 * @returns {Promise<UserWithTokensDTO>} - The user DTO with access and refresh tokens.
	 */
	async login(email, password) { throw new Error("Method not implemented."); }

	/**
	 * Invalidates the provided refresh token.
	 * @param {string} [refreshToken] - The refresh token to invalidate.
	 * @returns {Promise<void>}
	 */
	async logout(refreshToken) { throw new Error("Method not implemented."); }

	/**
	 * Fetches the user's profile data (DTO) by ID.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<UserDTO>} - The user's profile DTO.
	 */
	async getProfile(userId) { throw new Error("Method not implemented."); }

	/**
	 * Validates the access token and checks if the user still exists.
	 * @param {string} token - The access token.
	 * @returns {Promise<ValidateTokenDTO>} - The token validation result DTO.
	 */
	async validateAccessToken(token) { throw new Error("Method not implemented."); }

	/**
	 * Generates a new access token using a valid refresh token.
	 * @param {string} refreshToken - The refresh token.
	 * @returns {Promise<{accessToken: string}>} - The new access token.
	 */
	async refreshAccessToken(refreshToken) { throw new Error("Method not implemented."); }
}