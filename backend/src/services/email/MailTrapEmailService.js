import {mailtrapClient, sender} from "../../infrastructure/mailtrap.js";

import {IEmailService} from "../../interfaces/email/IEmailService.js";
import {IEmailContentService} from "../../interfaces/email/IEmailContentService.js";

import {SystemError} from "../../errors/index.js";

const EMAIL_CATEGORIES = {
	VERIFICATION: "Email Verification",
	RESET_REQUEST: "Password Reset Request",
	RESET_SUCCESS: "Password Reset Success"
};

export class MailTrapEmailService extends IEmailService {
	/** @type {IEmailContentService} */ #contentService;

	/**
	 * @param {IEmailContentService} contentService
	 */
	constructor(contentService) {
		super();
		this.#contentService = contentService;
	}

	async #sendEmail(to, subject, htmlContent, category) {
		const mailOptions = {
			from: sender,
			to: [{ email: to }],
			subject,
			html: htmlContent,
			category
		};

		try {
			await mailtrapClient.send(mailOptions);
			console.info(`[Email] ${category} sent to ${to}`);
		}
		catch (error) {
			console.error(`[Email Error] Failed to send ${category} to ${to}:`, error.message);
			throw new SystemError("Email delivery failed. Please try again later.");
		}
	}

	async sendVerificationEmail(email, verificationToken) {
		const subject = "Verify Your Email";
		const finalHtml = await this.#contentService.renderTemplate(
			"emailVerification.html",
			{ verificationCode: verificationToken }
		);

		await this.#sendEmail(email, subject, finalHtml, EMAIL_CATEGORIES.VERIFICATION);
	}

	async sendPasswordResetEmail(email, resetPasswordUrl) {
		const subject = "Reset Your Password";
		const finalHtml = await this.#contentService.renderTemplate(
			"passwordResetRequest.html",
			{ resetPasswordUrl: resetPasswordUrl }
		);

		await this.#sendEmail(email, subject, finalHtml, EMAIL_CATEGORIES.RESET_REQUEST);
	}

	async sendPasswordResetSuccessEmail(email) {
		const subject = "Password Reset Successful";
		const finalHtml = await this.#contentService.renderTemplate(
			"passwordResetSuccess.html",
			{}
		);

		await this.#sendEmail(email, subject, finalHtml, EMAIL_CATEGORIES.RESET_SUCCESS);
	}
}