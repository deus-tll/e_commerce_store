/**
 * Converts a string to a "slug" (a string convenient for use in a URL).
 * @param {string} value
 * @returns {string}
 */
export function toSlug(value) {
	return value
		.toString()
		.trim()
		.toLowerCase()
		.replace(/['"]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}