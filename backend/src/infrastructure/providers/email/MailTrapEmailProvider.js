import {IEmailProvider} from "./IEmailProvider.js";
import {IEmailContentProvider} from "./IEmailContentProvider.js";

import {SystemError} from "../../../errors/index.ts";

const EMAIL_CATEGORIES = {
	VERIFICATION: "Email Verification",
	RESET_REQUEST: "Password Reset Request",
	RESET_SUCCESS: "Password Reset Success"
};

export class MailTrapEmailProvider extends IEmailProvider {
	/** @type {import("mailtrap").MailtrapClient} */ #client;
	/** @type {{ email: string, name: string }} */ #sender;
	/** @type {IEmailContentProvider} */ #emailContentProvider;
	/** @type {string} */ #resetPasswordUrlBase;

	/**
	 * @param {import("mailtrap").MailtrapClient} client
	 * @param {{ email: string, name: string }} sender
	 * @param {IEmailContentProvider} emailContentProvider
	 * @param {string} resetPasswordUrlBase
	 */
	constructor(client, sender, emailContentProvider, resetPasswordUrlBase) {
		super();
		this.#client = client;
		this.#sender = sender;
		this.#emailContentProvider = emailContentProvider;
		this.#resetPasswordUrlBase = resetPasswordUrlBase;
	}

	async #sendEmail(to, subject, htmlContent, category) {
		const mailOptions = {
			from: this.#sender,
			to: [{ email: to }],
			subject,
			html: htmlContent,
			category
		};

		try {
			await this.#client.send(mailOptions);
			console.info(`[Email] ${category} sent to ${to}`);
		}
		catch (error) {
			console.error(`[Email Error] Failed to send ${category} to ${to}:`, error.message);
			throw new SystemError("Email delivery failed. Please try again later.");
		}
	}

	async sendVerificationEmail(email, verificationToken) {
		const subject = "Verify Your Email";
		const finalHtml = await this.#emailContentProvider.renderTemplate(
			"emailVerification.html",
			{ verificationCode: verificationToken }
		);

		await this.#sendEmail(email, subject, finalHtml, EMAIL_CATEGORIES.VERIFICATION);
	}

	async sendPasswordResetEmail(email, resetToken) {
		const subject = "Reset Your Password";
		const finalHtml = await this.#emailContentProvider.renderTemplate(
			"passwordResetRequest.html",
			{ resetPasswordUrl: `${this.#resetPasswordUrlBase}/${resetToken}` }
		);

		await this.#sendEmail(email, subject, finalHtml, EMAIL_CATEGORIES.RESET_REQUEST);
	}

	async sendPasswordResetSuccessEmail(email) {
		const subject = "Password Reset Successful";
		const finalHtml = await this.#emailContentProvider.renderTemplate(
			"passwordResetSuccess.html",
			{}
		);

		await this.#sendEmail(email, subject, finalHtml, EMAIL_CATEGORIES.RESET_SUCCESS);
	}
}