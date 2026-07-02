import {Transporter} from "nodemailer";

import {IEmailProvider} from "./IEmailProvider.js";
import {EmailRecipient, EmailSender} from "./types.js";

import {SystemError} from "../../../errors/index.js";

import {getErrorMessage} from "../../../utils/error.js";

export class NodemailerEmailProvider extends IEmailProvider {
    constructor(
        private readonly client: Transporter,
        private readonly sender: EmailSender
    ) {
        super();
    }

    async send(recipient: EmailRecipient, subject: string, html: string, _category?: string): Promise<void> {
        try {
            await this.client.sendMail({
                from: `${this.sender.name} <${this.sender.email}>`,
                to: recipient.email,
                subject,
                html
            });
        }
        catch (error: unknown) {
            console.error(`[Nodemailer Error] Failed to send an email:`, getErrorMessage(error));
            throw new SystemError("Email delivery failed. Please try again later.");
        }
    }
}