import {mailtrapClient, sender} from "../../infrastructure/mailtrap.js";

import {IEmailService} from "../../interfaces/email/IEmailService.js";
import {IEmailContentService} from "../../interfaces/email/IEmailContentService.js";

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
			console.log(`Email sent successfully to ${to}`);
		}
		catch (error) {
			console.error(`Error sending email to ${to}:`, error);
			throw new Error("Failed to send email");
		}
	}

	async sendVerificationEmail(email, verificationToken) {
		const subject = "Verify Your Email";
		const category = "Email Verification";
		const finalHtml = await this.#contentService.renderTemplate(
			"emailVerification.html",
			{ verificationCode: verificationToken }
		);

		await this.#sendEmail(email, subject, finalHtml, category);
	}

	async sendPasswordResetEmail(email, resetPasswordUrl) {
		const subject = "Reset Your Password";
		const category = "Password Reset";

		const finalHtml = await this.#contentService.renderTemplate(
			"passwordResetRequest.html",
			{ resetPasswordUrl: resetPasswordUrl }
		);

		await this.#sendEmail(email, subject, finalHtml, category);
	}

	async sendPasswordResetSuccessEmail(email) {
		const subject = "Password Reset Successful";
		const category = "Password Reset";

		const finalHtml = await this.#contentService.renderTemplate(
			"passwordResetSuccess.html",
			{}
		);

		await this.#sendEmail(email, subject, finalHtml, category);
	}
}