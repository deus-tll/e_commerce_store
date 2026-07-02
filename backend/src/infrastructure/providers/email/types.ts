export interface EmailSender {
    email: string;
    name: string;
}

export type EmailRecipient = EmailSender;