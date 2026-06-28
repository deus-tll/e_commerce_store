export abstract class IEmailProvider {
	abstract send(to: string, subject: string, html: string, category?: string): Promise<void>;
}