import { CategoryEntity, CreateCategoryDTO, UpdateCategoryDTO, RepositoryPaginationResult } from "../../domain/index.js";

/**
 * @interface ICategoryRepository
 * @description Contract for working with category data in the persistence layer.
 */
export class ICategoryRepository {
	/**
	 * Creates and saves a new category record.
	 * @param {CreateCategoryDTO} data - The data for the new category.
	 * @returns {Promise<CategoryEntity>} - The newly created category record.
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates a category record by its ID.
	 * @param {string} id - The category ID.
	 * @param {UpdateCategoryDTO} data - The data for the update category.
	 * @returns {Promise<CategoryEntity | null>} - The updated category record.
	 */
	async updateById(id, data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a category record by its ID.
	 * @param {string} id - The category ID.
	 * @returns {Promise<CategoryEntity | null>} - The deleted category record.
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
	 * Finds all category records.
	 * @returns {Promise<CategoryEntity[]>} - A list of found category records.
	 */
	async findAll() {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds categories with pagination.
	 * @param {number} skip - The number of documents to skip.
	 * @param {number} limit - The maximum number of documents to return.
	 * @returns {Promise<RepositoryPaginationResult<CategoryEntity>>} - The paginated results.
	 */
	async findAndCount(skip, limit) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Checks if a category exists by its slug.
	 * @param {string} slug - The category slug.
	 * @returns {Promise<boolean>}
	 */
	async existsBySlug(slug) {
		throw new Error("Method not implemented.");
	}
}