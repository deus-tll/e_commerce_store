import {UserEntity} from "../../domain/index.js";

/**
 * @interface IUserTokenService
 * @description Contract for services managing user account tokens (verification, password reset)
 * and related lifecycle updates.
 */
export class IUserTokenService {
	/**
	 * Generates a random 6-digit number token for email verification.
	 * @returns {string}
	 */
	generateVerificationToken() {
		throw new Error("Method not implemented.");
	}

	/**
	 * Generates a secure random hex token for password reset.
	 * @returns {string}
	 */
	generateResetToken() {
		throw new Error("Method not implemented.");
	}

	/**
	 * Sets the email verification token for the user.
	 * @param {string} userId - The user ID.
	 * @param {string} token - The verification token.
	 * @param {Date} expiresAt - The expiration date.
	 * @returns {Promise<UserEntity | null>} - The updated user entity.
	 */
	async setVerificationToken(userId, token, expiresAt) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a user by a valid verification token, verifies them, and clears the token fields.
	 * @param {string} token - The verification token.
	 * @returns {Promise<UserEntity>} - The updated user entity.
	 */
	async verifyUser(token) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Sets the password reset token for the user.
	 * @param {string} userId - The user ID.
	 * @param {string} token - The reset token.
	 * @param {Date} expiresAt - The expiration date.
	 * @returns {Promise<UserEntity | null>} - The updated user entity.
	 */
	async setResetPasswordToken(userId, token, expiresAt) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a user by a valid reset token, updates their password, and clears the token fields.
	 * @param {string} token - The reset token.
	 * @param {string} newPassword - The new plaintext password.
	 * @returns {Promise<UserEntity>} - The updated user entity.
	 */
	async resetPassword(token, newPassword) {
		throw new Error("Method not implemented.");
	}
}