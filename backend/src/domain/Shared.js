/**
 * Repository-level pagination result, containing the raw Entity list and total count.
 * @template T
 */
export class RepositoryPaginationResult {
	/** @type {Array<T>} */ results;
	/** @type {number} */ total;

	/**
	 * @param {Array<T>} results
	 * @param {number} total
	 */
	constructor(results, total) {
		this.results = results;
		this.total = total;
	}
}

/**
 * Agnostic class for pagination metadata, typically used by the Service layer.
 */
export class PaginationMetadata {
	/** @type {number} */ page;
	/** @type {number} */ limit;
	/** @type {number} */ total;
	/** @type {number} */ pages;

	/**
	 * @param {number} page
	 * @param {number} limit
	 * @param {number} total
	 * @param {number} pages
	 */
	constructor(page, limit, total, pages) {
		this.page = page;
		this.limit = limit;
		this.total = total;
		this.pages = pages;
	}
}