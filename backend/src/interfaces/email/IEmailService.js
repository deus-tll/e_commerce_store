/**
 * @interface IEmailService
 * @description Contract for handling all email sending logic.
 */
export class IEmailService {
	/**
	 * Sends an email verification code to the user.
	 * @param {string} email
	 * @param {string} verificationToken
	 * @returns {Promise<void>}
	 */
	async sendVerificationEmail(email, verificationToken) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Sends a password reset link.
	 * @param {string} email
	 * @param {string} resetPasswordUrl
	 * @returns {Promise<void>}
	 */
	async sendPasswordResetEmail(email, resetPasswordUrl) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Sends a confirmation email after a successful password change/reset.
	 * @param {string} email
	 * @returns {Promise<void>}
	 */
	async sendPasswordResetSuccessEmail(email) {
		throw new Error("Method not implemented.");
	}
}