/**
 * @interface ISlugUtility
 * @description Contract for utilities responsible for generating URL-safe, unique slugs.
 */
export class ISlugUtility {
	/**
	 * Converts a string into a URL-safe slug.
	 * @param {string} text - The input string (e.g., category name).
	 * @returns {string} - The generated slug (e.g., 'category-name').
	 */
	generateSlug(text) {
		throw new Error("Method not implemented.");
	}
}