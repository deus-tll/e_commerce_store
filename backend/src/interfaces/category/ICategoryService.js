import { CategoryDTO, CategoryPaginationResultDTO } from "../../domain/index.js";

/**
 * @interface ICategoryService
 * @description Agnostic business logic layer for category operations.
 */
export class ICategoryService {
	/**
	 * Creates a new category.
	 * @param {CreateCategoryDTO} data - The data for the new category.
	 * @returns {Promise<CategoryDTO>} - The newly created category DTO.
	 */
	async create(data) { throw new Error("Method not implemented."); }

	/**
	 * Updates an existing category.
	 * @param {string} id - The category ID.
	 * @param {UpdateCategoryDTO} data - The data for the update category.
	 * @returns {Promise<CategoryDTO>} - The updated category DTO.
	 */
	async update(id, data) { throw new Error("Method not implemented."); }

	/**
	 * Deletes a category and its associated image from storage.
	 * @param {string} id - The category ID.
	 * @returns {Promise<CategoryDTO>} - The deleted category DTO.
	 */
	async delete(id) { throw new Error("Method not implemented."); }

	/**
	 * Gets all categories with pagination.
	 * @param {number} [page] - The page number.
	 * @param {number} [limit] - The maximum number of documents per page.
	 * @returns {Promise<CategoryPaginationResultDTO>} - The paginated list of categories.
	 */
	async getAll(page, limit) { throw new Error("Method not implemented."); }

	/**
	 * Finds a category by its ID.
	 * @param {string} id - The category ID.
	 * @returns {Promise<CategoryDTO | null>} - The found category DTO.
	 */
	async getById(id) { throw new Error("Method not implemented."); }

	/**
	 * Finds a category by its ID or throws if not found.
	 * @param {string} id - The category ID.
	 * @returns {Promise<CategoryDTO>} - The found category DTO.
	 */
	async getByIdOrFail(id) { throw new Error("Method not implemented."); }

	/**
	 * Finds a category by its slug.
	 * @param {string} slug - The category slug.
	 * @returns {Promise<CategoryDTO | null>} - The found category DTO.
	 */
	async getBySlug(slug) { throw new Error("Method not implemented."); }

	/**
	 * Finds a category by its slug, throwing an error if not found.
	 * @param {string} slug
	 * @returns {Promise<CategoryDTO>}
	 */
	async getBySlugOrFail(slug) { throw new Error("Method not implemented."); }
}