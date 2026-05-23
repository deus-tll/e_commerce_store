import {ProductFiltersInput, ProductParserContext, ProductPersistenceQuery} from "../dtos/product.dto.js";

export function parseProductQuery(
	filters: ProductFiltersInput,
	context: ProductParserContext = { categoryId: null }
): ProductPersistenceQuery {
	const attributes: Record<string, string | string[]> = filters.attributes;

	return {
		...(context.categoryId && {categoryId: context.categoryId}),
		...(filters.search && {search: filters.search}),
		...(attributes && Object.keys(attributes).length > 0 && {
			attributes: structuredClone(attributes)
		})
	};
}