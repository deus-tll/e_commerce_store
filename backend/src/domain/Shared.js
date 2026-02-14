/**
 * Repository-level pagination result, containing the raw Entity list and total count.
 * @template T
 */
export class RepositoryPaginationResult {
	/** @type {T[]} @readonly */ results;
	/** @type {number} @readonly */ total;

	/**
	 * @param {T[]} results
	 * @param {number} total
	 */
	constructor(results, total) {
		this.results = results;
		this.total = total;

		Object.freeze(this);
	}
}

/**
 * Agnostic class for pagination metadata, typically used by the Service layer.
 */
export class PaginationMetadata {
	/** @type {number} @readonly */ page;
	/** @type {number} @readonly */ limit;
	/** @type {number} @readonly */ total;
	/** @type {number} @readonly */ pages;

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

		Object.freeze(this);
	}
}