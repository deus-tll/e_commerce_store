import { IProductQueryBuilder } from "../../interfaces/product/IProductQueryBuilder.js";
import { ICategoryService } from "../../interfaces/category/ICategoryService.js";

/**
 * @augments IProductQueryBuilder
 * @description Service dedicated to transforming complex, external filter parameters into
 * simple, repository-ready query objects.
 */
export class ProductQueryBuilder extends IProductQueryBuilder {
	/** @type {ICategoryService} */ #categoryService;

	/**
	 * @param {ICategoryService} categoryService
	 */
	constructor(categoryService) {
		super();
		this.#categoryService = categoryService;
	}

	async buildQuery(filters) {
		const agnosticQuery = {};

		// 1. Handle Category Slug Filter
		if (filters.categorySlug) {
			// Requires calling the Category Service
			const categoryDTO = await this.#categoryService.getBySlug(filters.categorySlug);

			if (categoryDTO) {
				// Map domain-specific slug to agnostic repository ID
				agnosticQuery.categoryId = categoryDTO.id;
			} else {
				// If slug yields no category, the result set is guaranteed empty.
				return null;
			}
		}

		// 2. Handle Search Filter (Agnostic term)
		if (filters.search && filters.search.trim()) {
			agnosticQuery.search = filters.search.trim();
		}

		return agnosticQuery;
	}
}