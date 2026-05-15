/**
 * Abstract contract for Email provider's management.
 */
export abstract class IEmailProvider {
	abstract send(to: string, subject: string, html: string, category?: string): Promise<void>;
}