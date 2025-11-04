/**
 * @interface IEmailContentService
 * @description Contract for rendering email templates by replacing placeholders with provided data.
 */
export class IEmailContentService {
	/**
	 * Renders an email template using the given data for placeholder replacement.
	 * @param {string} templateName - The filename of the template (e.g., 'emailVerification.html').
	 * @param {Object} data - Key-value pairs for placeholder substitution (e.g., { verificationCode: 'xyz' }).
	 * @returns {Promise<string>} - The fully rendered HTML content.
	 */
	async renderTemplate(templateName, data) {
		throw new Error("IEmailContentService::renderTemplate must be implemented.");
	}
}