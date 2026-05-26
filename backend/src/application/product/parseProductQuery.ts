import {ProductFiltersInput, ProductParserContext, ProductQueryPersistence} from "../types/product.types.js";

export function parseProductQuery(
	filters: ProductFiltersInput,
	context: ProductParserContext = { categoryId: null }
): ProductQueryPersistence {
	const { search, attributes } = filters;
	const { categoryId } = context;

	return Object.freeze({
		...(categoryId && { categoryId }),
		...(search && { search }),
		...(attributes && Object.keys(attributes).length > 0 && {
			attributes: structuredClone(attributes)
		})
	});
}