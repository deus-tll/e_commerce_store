/**
 * @interface IEmailService
 * @description Contract for handling all email sending and token generation logic.
 */
export class IEmailService {
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