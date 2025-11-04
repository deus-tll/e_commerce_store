import {ISlugGenerator} from "../../interfaces/utils/ISlugGenerator.js";

/**
 * Concrete implementation of ISlugGenerator with encapsulated slugify logic.
 * @augments ISlugGenerator
 */
export class SlugGenerator extends ISlugGenerator {
	/**
	 * Converts a string to a "slug" (a string convenient for use in a URL).
	 * @param {string} value - The input string (e.g., category name).
	 * @returns {string} - The generated slug (e.g., 'category-name').
	 */
	#toSlug(value) {
		return value
			.toString()
			.trim()
			.toLowerCase()
			.replace(/['"]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)+/g, "");
	}

	generateSlug(text) {
		return this.#toSlug(text);
	}
}