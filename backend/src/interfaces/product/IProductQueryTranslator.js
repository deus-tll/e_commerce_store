/**
 * @interface IProductQueryTranslator
 * @description Contract for translating complex filter DTOs (e.g., categorySlug)
 * into simple, agnostic repository query objects.
 */
export class IProductQueryTranslator {
	/**
	 * Converts a raw filters object into a repository query object.
	 * @param {object} filters - Raw filters from the controller (e.g., { attributes, search }).
	 * @param {object} [resolvedFilters={}] - Pre-resolved filters from the service (e.g., { categoryId }).
	 * @returns {{}} - The agnostic query object for the repository.
	 */
	translate(filters, resolvedFilters = {}) { throw new Error("Method not implemented."); }
}