import {BaseCacheService} from "./BaseCacheService.js";

import {CacheKeys} from "../constants/app.js";

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
		return "PRODUCTS";
	}

	/**
	 * Retrieves the cached list of featured products.
	 * @returns {Promise<ProductDTO[] | null>} Array of Product DTOs or null if not found.
	 */
	async getFeaturedProducts() {
		return await this._get(CacheKeys.FEATURED_PRODUCTS);
	}

	/**
	 * Stores the list of featured products.
	 * @param {ProductDTO[]} productDTOs
	 * @returns {Promise<void>}
	 */
	async setFeaturedProducts(productDTOs) {
		await this._set(CacheKeys.FEATURED_PRODUCTS, productDTOs);
	}

	/**
	 * Removes the cached featured products list.
	 * @returns {Promise<void>}
	 */
	async invalidateFeaturedProducts() {
		await this._delete(CacheKeys.FEATURED_PRODUCTS);
	}
}