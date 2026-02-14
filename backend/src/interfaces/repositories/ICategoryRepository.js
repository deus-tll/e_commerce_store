import { CategoryEntity, RepositoryPaginationResult } from "../../domain/index.js";

/**
 * @typedef {import("../../domain/index.js").CategoryEntity} CategoryEntity
 * @typedef {import("../../domain/index.js").RepositoryPaginationResult<CategoryEntity>} CategoryPaginationResult
 */

/**
 * @interface ICategoryRepository
 * @description Contract for working with category data in the persistence layer.
 */
export class ICategoryRepository {
	/**
	 * Creates and saves a new category record.
	 * @param {Object} data - The data for the new category.
	 * @returns {Promise<CategoryEntity>} - The newly created category record.
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates a category record by its ID.
	 * @param {string} id - The category ID.
	 * @param {Object} data - The data for the update category.
	 * @returns {Promise<CategoryEntity>} - The updated category record.
	 */
	async updateById(id, data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a category record by its ID.
	 * @param {string} id - The category ID.
	 * @returns {Promise<CategoryEntity>} - The deleted category record.
	 */
	async deleteById(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a category record by its ID.
	 * @param {string} id - The category ID.
	 * @returns {Promise<CategoryEntity | null>} - The found category record.
	 */
	async findById(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a category record by its slug.
	 * @param {string} slug - The category slug.
	 * @returns {Promise<CategoryEntity | null>} - The found category record.
	 */
	async findBySlug(slug) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds categories by an array of IDs.
	 * @param {string[]} ids - Array of category IDs.
	 * @returns {Promise<CategoryEntity[]>} - A list of found category records.
	 */
	async findByIds(ids) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds categories with pagination.
	 * @param {object} query - The filtering query.
	 * @param {number} skip - The number of documents to skip.
	 * @param {number} limit - The maximum number of documents to return.
	 * @returns {Promise<RepositoryPaginationResult<CategoryEntity>>} - The paginated results.
	 */
	async findAndCount(query, skip, limit) {
		throw new Error("Method not implemented.");
	}
}