/**
 * @interface IUserQueryTranslator
 * @description Defines the contract for translating complex, domain-specific filters
 * into a simple, agnostic query object for the repository layer.
 */
export class IUserQueryTranslator {
	/**
	 * Converts raw filters into an agnostic query object.
	 * @param {object} filters - Raw filters from the controller/client.
	 * @returns {{}} - The agnostic query object for the repository.
	 */
	translate(filters) { throw new Error("Method not implemented."); }
}