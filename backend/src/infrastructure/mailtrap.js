import {MailtrapClient} from "mailtrap";
import {config} from "../config.js";

export const mailtrapClient = new MailtrapClient({
	endpoint: config.providers.mail.mailtrap.endpoint,
	token: config.providers.mail.mailtrap.token,
});

export const sender = {
	email: config.providers.mail.mailtrap.sender.email,
	name: config.providers.mail.mailtrap.sender.name
}