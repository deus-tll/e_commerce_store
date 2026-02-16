import {MailtrapClient} from "mailtrap";
import {config} from "../config.js";

export const mailtrapClient = new MailtrapClient({
	endpoint: config.mail.endpoint,
	token: config.mail.token,
});

export const sender = {
	email: config.mail.senderEmail,
	name: config.mail.senderName
}