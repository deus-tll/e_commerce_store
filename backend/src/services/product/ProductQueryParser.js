import {IQueryParser} from "../../interfaces/parsers/IQueryParser.js";

/**
 * @augments IQueryParser
 * @description Concrete implementation of product query parser.
 */
export class ProductQueryParser extends IQueryParser {
	parse(filters, context = {}) {
		const query = {};

		if (context.categoryId) query.categoryId = context.categoryId;
		if (filters.search) query.search = filters.search;

		const attributes = filters.attributes;
		if (attributes && Object.keys(attributes).length > 0)
			query.attributes = structuredClone(attributes);

		return query;
	}
}