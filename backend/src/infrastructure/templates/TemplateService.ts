import * as fs from "fs/promises";
import path from "path";

import {SystemError} from "../../errors/index.js";

/**
 * Infrastructure service that can perform various operations on template files
 */
export class TemplateService {
	private readonly baseDir: string;

	constructor(baseDir?: string) {
		this.baseDir = baseDir || path.join(process.cwd(), "src", "templates");
	}

	private async readTemplate(templatePath: string): Promise<string> {
		const fullPath = path.join(this.baseDir, templatePath);

		try {
			return await fs.readFile(fullPath, "utf-8");
		}
		catch (error: unknown) {
			const err = error as NodeJS.ErrnoException;
			console.error(`[TemplateService] Failed to read template file: ${fullPath}. Code: ${err.code}, Message: ${err.message}.`);
			throw new SystemError("An error occurred while processing the template.");
		}
	}

	async replacePlaceholders(templatePath: string, data: Record<string, any>) {
		let content = await this.readTemplate(templatePath);

		for (const [key, value] of Object.entries(data)) {
			const placeholder = new RegExp(`{${key}}`, 'g');
			content = content.replace(placeholder, String(value));
		}

		return content;
	}
}