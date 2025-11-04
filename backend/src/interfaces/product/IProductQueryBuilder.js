/**
 * @interface IProductQueryBuilder
 * @description Contract for translating complex filter DTOs (e.g., categorySlug)
 * into simple, agnostic repository query objects.
 */
export class IProductQueryBuilder {
	/**
	 * Converts a raw filters object into a repository query object.
	 * @param {object} filters - Raw filters from the controller (e.g., { categorySlug, search }).
	 * @returns {Promise<object | null>} - The agnostic query object for the repository,
	 * or null if the filters result in an empty set.
	 */
	async buildQuery(filters) { throw new Error("Method not implemented."); }
}