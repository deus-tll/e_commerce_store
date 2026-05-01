import {ISlugUtility} from "../../interfaces/utilities/ISlugUtility.js";

/**
 * Concrete implementation for encapsulated slugify logic.
 * @augments ISlugUtility
 */
export class SlugUtility extends ISlugUtility {
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