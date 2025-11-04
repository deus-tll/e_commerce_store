import * as fs from "fs/promises";
import path from "path";

import {IEmailContentService} from "../../interfaces/email/IEmailContentService.js";

const templatesDir = path.join(process.cwd(), "src", "templates");

/**
 * Concrete implementation of IEmailContentService that reads HTML templates
 * from the filesystem and performs simple placeholder replacement.
 * @augments IEmailContentService
 */
export class FilesystemEmailContentService extends IEmailContentService {
	/**
	 * Reads a template file from the filesystem.
	 * @param {string} templateName - The filename of the template.
	 * @returns {Promise<string>} - The raw template content.
	 */
	async #readTemplate(templateName) {
		const templatePath = path.join(templatesDir, templateName);

		try {
			return fs.readFile(templatePath, "utf-8");
		}
		catch (error) {
			console.error(`Error reading email template ${templateName}:`, error);
			throw new Error("Failed to read email template file.");
		}
	}

	/**
	 * Renders a template by reading it from disk and replacing placeholders.
	 * @param {string} templateName - The filename of the template (e.g., 'emailVerification.html').
	 * @param {Object} data - Key-value pairs for placeholder substitution.
	 * @returns {Promise<string>} - The fully rendered HTML content.
	 */
	async renderTemplate(templateName, data) {
		let htmlContent = await this.#readTemplate(templateName);

		for (const [key, value] of Object.entries(data)) {
			const placeholder = new RegExp(`{${key}}`, 'g');
			htmlContent = htmlContent.replace(placeholder, String(value));
		}

		return htmlContent;
	}
}