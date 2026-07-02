import {EmailRecipient} from "./types.js";

export abstract class IEmailProvider {
	abstract send(recipient: EmailRecipient, subject: string, html: string, category?: string): Promise<void>;
}