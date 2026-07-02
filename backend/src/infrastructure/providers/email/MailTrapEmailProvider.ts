import {MailtrapClient} from "mailtrap";

import {IEmailProvider} from "./IEmailProvider.js";
import {EmailRecipient, EmailSender} from "./types.js";

import {SystemError} from "../../../errors/index.js";

import {getErrorMessage} from "../../../utils/error.js";

export class MailTrapEmailProvider extends IEmailProvider {
	constructor(
		private readonly client: MailtrapClient,
		private readonly sender: EmailSender
	) {
		super();
	}

	async send(recipient: EmailRecipient, subject: string, html: string, category?: string): Promise<void> {
		try {
			await this.client.send({
				from: this.sender,
				to: [{ email: recipient.email, name: recipient.name }],
				subject,
				html: html,
				category
			});
		}
		catch (error: unknown) {
			console.error(`[Mailtrap Error] Failed to send an email:`, getErrorMessage(error));
			throw new SystemError("Email delivery failed. Please try again later.");
		}
	}
}