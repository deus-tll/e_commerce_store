/**
 * @interface IQueryParser
 * @description Contract for parsing and transforming raw filter objects
 * into agnostic repository query criteria
 */
export class IQueryParser {
    /**
     * @param {object} filters - Raw filters from the controller.
     * @param {object} [context] - Optional additional data (e.g., resolved IDs).
     * @returns {{}} - The parsed query object.
     */
    parse(filters, context = {}) {
        throw new Error("Method not implemented.");
    }
}
