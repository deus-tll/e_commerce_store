import {IProductQueryTranslator} from "../../interfaces/product/IProductQueryTranslator.js";

/**
 * @augments IProductQueryTranslator
 * @description Service dedicated to translating complex, external filter parameters into
 * simple, repository-ready query objects.
 */
export class ProductQueryTranslator extends IProductQueryTranslator {
	translate(filters, resolvedFilters = {}) {
		const agnosticQuery = {};

		// 1. Handle Category Filter
		if (resolvedFilters.categoryId) {
			agnosticQuery.categoryId = resolvedFilters.categoryId;
		}

		// 2. Handle Search Filter
		if (filters.search) {
			agnosticQuery.search = filters.search;
		}

		// 3. Handle Dynamic Attribute Filters
		if (filters.attributes && Object.keys(filters.attributes).length > 0) {
			agnosticQuery.attributes = structuredClone(filters.attributes);
		}

		return agnosticQuery;
	}
}