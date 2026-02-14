import { MailtrapClient } from "mailtrap";

export const mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAILTRAP_ENDPOINT,
	token: process.env.MAILTRAP_TOKEN,
});

export const sender = {
	email: process.env.MAILTRAP_SENDER_EMAIL,
	name: process.env.MAILTRAP_SENDER_NAME,
}