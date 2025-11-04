/**
 * @interface ISlugGenerator
 * @description Contract for services responsible for generating URL-safe, unique slugs.
 */
export class ISlugGenerator {
	/**
	 * Converts a string into a URL-safe slug.
	 * @param {string} text - The input string (e.g., category name).
	 * @returns {string} - The generated slug (e.g., 'category-name').
	 */
	generateSlug(text) {
		throw new Error("Method not implemented.");
	}
}