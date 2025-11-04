import {UserWithTokensDTO, CreateUserDTO} from "../../domain/index.js";

/**
 * @interface IUserAccountService
 * @description Contract for managing user account creation, verification,
 * and password recovery/change workflows.
 */
export class IUserAccountService {
	/**
	 * Handles user registration, token generation, and sending verification email.
	 * @param {CreateUserDTO} data - The data for the new user.
	 * @returns {Promise<UserWithTokensDTO>} - The new user DTO with access and refresh tokens.
	 */
	async signup(data) { throw new Error("Method not implemented."); }

	/**
	 * Verifies the user's email using the provided code.
	 * @param {string} code - The email verification token.
	 * @returns {Promise<UserWithTokensDTO>} - The verified user DTO with new tokens.
	 */
	async verifyEmail(code) { throw new Error("Method not implemented."); }

	/**
	 * Resends the email verification code.
	 * @param {string} userId - The user ID.
	 * @returns {Promise<{message: string}>} - A success message.
	 */
	async resendVerificationEmail(userId) { throw new Error("Method not implemented."); }

	/**
	 * Initiates the password reset process by generating a token and sending an email.
	 * @param {string} email - The user's email.
	 * @returns {Promise<{message: string}>} - A success message.
	 */
	async forgotPassword(email) { throw new Error("Method not implemented."); }

	/**
	 * Resets the password using the reset token.
	 * @param {string} token - The password reset token.
	 * @param {string} password - The new password.
	 * @returns {Promise<UserWithTokensDTO>} - The user DTO with new tokens after reset.
	 */
	async resetPassword(token, password) { throw new Error("Method not implemented."); }

	/**
	 * Allows a logged-in user to change their password.
	 * @param {string} userId - The user ID.
	 * @param {string} currentPassword - The current password.
	 * @param {string} newPassword - The new password.
	 * @returns {Promise<{message: string}>} - A success message.
	 */
	async changePassword(userId, currentPassword, newPassword) { throw new Error("Method not implemented."); }
}