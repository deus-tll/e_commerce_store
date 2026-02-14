import {
	ProductDTO,
	ShortProductDTO,
	CreateProductDTO,
	UpdateProductDTO,
	ProductPaginationResultDTO
} from "../../domain/index.js";

/**
 * @interface IProductService
 * @description Agnostic business logic layer for product operations.
 */
export class IProductService {
	/**
	 * Creates a new product, handling image uploads and category resolution.
	 * @param {CreateProductDTO} data - The data for the new product.
	 * @returns {Promise<ProductDTO>} - The newly created product DTO.
	 */
	async create(data) { throw new Error("Method not implemented."); }

	/**
	 * Updates an existing product, handling image/category logic.
	 * @param {string} id - The product ID.
	 * @param {UpdateProductDTO} data - The data for the update product.
	 * @returns {Promise<ProductDTO>} - The updated product DTO.
	 */
	async update(id, data) { throw new Error("Method not implemented."); }

	/**
	 * Toggles the 'isFeatured' status of a product and updates the cache.
	 * @param {string} id - The product ID.
	 * @returns {Promise<ProductDTO>} - The updated product DTO.
	 */
	async toggleFeatured(id) { throw new Error("Method not implemented."); }

	/**
	 * Updates the product's average rating and total review count atomically.
	 * @param {string} productId - The product ID.
	 * @param {number} ratingChange - The change in rating value.
	 * @param {number} totalReviewsChange - +1 for create, -1 for delete, 0 for update.
	 * @param {number} oldRating - The previous rating value.
	 * @returns {Promise<void>}
	 */
	async updateRatingStats(productId, ratingChange, totalReviewsChange, oldRating) { throw new Error("Method not implemented."); }

	/**
	 * Deletes a product, managing image deletion from storage and cache invalidation.
	 * @param {string} id - The product ID.
	 * @returns {Promise<ProductDTO>} - The deleted product DTO.
	 */
	async delete(id) { throw new Error("Method not implemented."); }

	/**
	 * Gets products with pagination and filtering.
	 * @param {number} [page] - The page number.
	 * @param {number} [limit] - The maximum number of documents per page.
	 * @param {object} [filters] - The filtering query object.
	 * @returns {Promise<ProductPaginationResultDTO>} - The paginated list of products.
	 */
	async getAll(page, limit, filters) { throw new Error("Method not implemented."); }

	/**
	 * Finds a product by ID.
	 * @param {string} id - The product ID.
	 * @returns {Promise<ProductDTO | null>} - The found product DTO.
	 */
	async getById(id) { throw new Error("Method not implemented."); }

	/**
	 * Finds a product by ID, throwing an error if not found.
	 * @param {string} id - The product ID.
	 * @returns {Promise<ProductDTO>} - The found product DTO.
	 */
	async getByIdOrFail(id) { throw new Error("Method not implemented."); }

	/**
	 * Retrieves cached featured products.
	 * @returns {Promise<ProductDTO[]>} - A list of featured product DTOs.
	 */
	async getFeatured() { throw new Error("Method not implemented."); }

	/**
	 * Retrieves attribute facets (unique keys and values) for a specific category.
	 * @param {string} categoryId - The ID of the category.
	 * @returns {Promise<AttributeFacetDTO[]>} - List of attribute facets.
	 */
	async getCategoryFacets(categoryId) { throw new Error("Method not implemented."); }

	/**
	 * Gets a random sample of recommended products.
	 * @returns {Promise<ProductDTO[]>} - A list of recommended product DTOs.
	 */
	async getRecommended() { throw new Error("Method not implemented."); }

	/**
	 * Finds a minimal set of product details for an array of IDs.
	 * @param {string[]} ids - Array of product IDs.
	 * @returns {Promise<ShortProductDTO[]>} - A list of short product DTOs.
	 */
	async getShortDTOsByIds(ids) { throw new Error("Method not implemented."); }

	/**
	 * Checks if a product exists by ID.
	 * @param {string} id
	 * @returns {Promise<boolean>}
	 */
	async exists(id) { throw new Error("Method not implemented."); }
}