/**
 * @interface IUserQueryBuilder
 * @description Defines the contract for converting complex, domain-specific filters
 * into a simple, agnostic query object for the repository layer.
 */
export class IUserQueryBuilder {
	/**
	 * Converts raw filters into an agnostic query object.
	 * @param {object} filters - Raw filters from the controller/client.
	 * @returns {object} - The agnostic query object for the repository.
	 */
	buildQuery(filters) { throw new Error("Method not implemented."); }
}