import { ProductEntity, RepositoryPaginationResult } from "../../domain/index.js";

/**
 * @typedef {import("../../domain/index.js").ProductEntity} ProductEntity
 * @typedef {import("../../domain/index.js").RepositoryPaginationResult<ProductEntity>} ProductPaginationResult
 */

/**
 * @interface IProductRepository
 * @description Contract for working with product data in the persistence layer.
 */
export class IProductRepository {
	/**
	 * Creates and saves a new product record.
	 * @param {Object} data - The data for the new product.
	 * @returns {Promise<ProductEntity>} - The newly created product record.
	 */
	async create(data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Updates a product entity by its ID.
	 * @param {string} id - The product ID.
	 * @param {Object} data - The data for the update product.
	 * @returns {Promise<ProductEntity | null>} - The updated product record.
	 */
	async updateById(id, data) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Atomically updates product rating statistics based on a review change.
	 * @param {string} productId - The product ID.
	 * @param {number} ratingChange - The change in rating value.
	 * @param {number} totalReviewsChange - +1 for create, -1 for delete, 0 for update.
	 * @param {number} oldRating - The previous rating value.
	 * @returns {Promise<void>}
	 */
	async updateRatingStats(productId, ratingChange, totalReviewsChange, oldRating) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Toggles the `isFeatured` status of a product by ID.
	 * @param {string} id - The product ID.
	 * @returns {Promise<ProductEntity | null>} - The updated product record.
	 */
	async toggleFeatured(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a product entity by its ID.
	 * @param {string} id - The product ID.
	 * @returns {Promise<ProductEntity | null>} - The deleted product record.
	 */
	async deleteById(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds a product by its ID.
	 * @param {string} id - The product ID.
	 * @returns {Promise<ProductEntity | null>} - The found product record.
	 */
	async findById(id) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds products and their total count for pagination purposes.
	 * @param {object} query - The filtering query.
	 * @param {number} skip - The number of documents to skip.
	 * @param {number} limit - The maximum number of documents to return.
	 * @param {object} [options={}] - Options(such as sortBy and order).
	 * @returns {Promise<RepositoryPaginationResult<ProductEntity>>} - The paginated results.
	 */
	async findAndCount(query, skip, limit, options = {}) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Counts the total number of product documents matching the query.
	 * @param {object} [query={}] - The filtering query (e.g., { category: '...' }).
	 * @returns {Promise<number>} - The total number of documents found.
	 */
	async count(query = {}) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds products by an array of IDs.
	 * @param {string[]} ids - Array of product IDs.
	 * @returns {Promise<ProductEntity[]>} - A list of found product records.
	 */
	async findByIds(ids) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Finds products that match a featured status.
	 * @param {boolean} isFeatured - Whether to find featured (true) or non-featured (false) products.
	 * @returns {Promise<ProductEntity[]>} - A list of products matching the status.
	 */
	async findByFeaturedStatus(isFeatured) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Discovers unique attribute names and values within a specific category.
	 * @param {string} categoryId - The ID of the category to analyze.
	 * @returns {Promise<AttributeFacetDTO[]>} - List of facets.
	 */
	async getAttributeFacets(categoryId) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Gets a random sample of products for recommendation purposes.
	 * @param {number} size - The number of products to return.
	 * @returns {Promise<ProductEntity[]>} - A list of recommended product records.
	 */
	async findRecommended(size) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Checks if a product exists by ID.
	 * @param {string} id - The product ID.
	 * @returns {Promise<boolean>}
	 */
	async existsById(id) {
		throw new Error("Method not implemented.");
	}
}