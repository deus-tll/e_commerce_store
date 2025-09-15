import fs from "fs";
import path from "path";
import crypto from "crypto";

import {mailtrapClient, sender} from "../config/mailtrap.js";

const templatesDir = path.join(process.cwd(), "src", "templates");

export class EmailService {
	async #readTemplate(templateName) {
		const templatePath = path.join(templatesDir, templateName);

		try {
			return fs.readFileSync(templatePath, "utf-8");
		}
		catch (error) {
			console.error(`Error reading email template ${templateName}:`, error);
			throw new Error("Failed to read email template");
		}
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

	generateVerificationToken() {
		return Math.floor(100000 + Math.random() * 900000).toString();
	}

	generateResetToken() {
		return crypto.randomBytes(20).toString("hex");
	}

	async sendVerificationEmail(email, verificationToken) {
		const subject = "Verify Your Email";
		const htmlContent = await this.#readTemplate("emailVerification.html");
		const finalHtml = htmlContent.replace("{verificationCode}", verificationToken);
		const category = "Email Verification";

		await this.#sendEmail(email, subject, finalHtml, category);
	}

	async sendPasswordResetEmail(email, resetPasswordUrl) {
		const subject = "Reset Your Password";
		const htmlContent = await this.#readTemplate("passwordResetRequest.html");
		const finalHtml = htmlContent.replace("{resetPasswordUrl}", resetPasswordUrl);
		const category = "Password Reset";

		await this.#sendEmail(email, subject, finalHtml, category);
	}

	async sendPasswordResetSuccessEmail(email) {
		const subject = "Password Reset Successful";
		const htmlContent = await this.#readTemplate("passwordResetSuccess.html");
		const category = "Password Reset";

		await this.#sendEmail(email, subject, htmlContent, category);
	}
}