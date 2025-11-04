import {BaseCacheService} from "./BaseCacheService.js";
import {CacheKeys} from "../utils/constants.js";

/**
 * Manages the storage and retrieval of product related data in the cache (Redis).
 * @augments BaseCacheService
 */
export class ProductCacheService extends BaseCacheService {
	/**
	 * Defines the full, context-qualified prefix for this cache service's keys.
	 * @returns {string} The prefix, e.g., "PRODUCTS:featured_products".
	 * @protected
	 */
	get _cacheContextPrefix() {
		return `PRODUCTS:${CacheKeys.FEATURED_PRODUCTS}`;
	}

	/**
	 * Retrieves the cached list of featured products.
	 * @returns {Promise<ProductDTO[] | null>} Array of Product DTOs or null if not found.
	 */
	async getFeaturedProducts() {
		const cached = await this._get("");
		return cached ? JSON.parse(cached) : null;
	}

	/**
	 * Stores the list of featured products.
	 * @param {object[]} productDTOs
	 * @returns {Promise<void>}
	 */
	async setFeaturedProducts(productDTOs) {
		await this._set("", JSON.stringify(productDTOs));
	}

	/**
	 * Removes the cached featured products list.
	 * @returns {Promise<void>}
	 */
	async invalidateFeaturedProducts() {
		await this._delete("");
	}
}