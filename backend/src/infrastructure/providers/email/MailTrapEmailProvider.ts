import {MailtrapClient} from "mailtrap";
import {IEmailProvider} from "./IEmailProvider.js";
import {SystemError} from "../../../errors/index.js";

export class EmailSender {
	public email: string;
	public name: string;

	constructor(email: string, name: string) {
		this.email = email;
		this.name = name;
	}
}

export class MailTrapEmailProvider extends IEmailProvider {
	private readonly client: MailtrapClient;
	private readonly sender: EmailSender;

	constructor(client: MailtrapClient, sender: EmailSender) {
		super();
		this.client = client;
		this.sender = sender;
	}

	async send(to: string, subject: string, html: string, category: string) {
		try {
			await this.client.send({
				from: this.sender,
				to: [{ email: to }],
				subject,
				html: html,
				category
			});
		}
		catch (error) {
			console.error(`[Mailtrap Error] Failed to send an email:`, error.message);
			throw new SystemError("Email delivery failed. Please try again later.");
		}
	}
}