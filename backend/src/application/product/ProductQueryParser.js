export class ProductQueryParser {
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