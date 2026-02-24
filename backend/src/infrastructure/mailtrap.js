import {MailtrapClient} from "mailtrap";
import {config} from "../config.js";

export const mailtrapClient = new MailtrapClient({
	endpoint: config.services.mail.endpoint,
	token: config.services.mail.token,
});

export const sender = {
	email: config.services.mail.sender.email,
	name: config.services.mail.sender.name
}