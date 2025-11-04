import { ProductDTO } from "../../domain/index.js";

/**
 * @interface IProductCacheManager
 * @description Contract for handling read-through/write-through cache logic for Products.
 */
export class IProductCacheManager {
	/**
	 * Retrieves the list of featured products, fetching from the repository and
	 * writing to the cache if a miss occurs (Read-Through Cache Pattern).
	 * @returns {Promise<ProductDTO[]>} - A list of featured product DTOs.
	 */
	async getFeaturedProducts() { throw new Error("Method not implemented."); }

	/**
	 * Updates the featured products list in the cache by re-fetching and setting the new list.
	 * This is used when a product's featured status changes (Write-Through Cache Pattern).
	 * @returns {Promise<void>}
	 */
	async updateFeaturedProducts() { throw new Error("Method not implemented."); }
}