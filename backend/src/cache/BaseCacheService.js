import { redis } from "../config/redis.js";

/**
 * @abstract
 * Base class for all specific cache services.
 * It encapsulates the connection to Redis and common cache methods.
 */
export class BaseCacheService {
	/** @protected */
	redis = redis;

	/**
	 * Defines the full, context-qualified prefix for this cache service's keys
	 * (e.g., "AUTH:refresh_token" or "PRODUCTS:featured_list").
	 * Must be implemented by subclasses.
	 * @returns {string}
	 * @protected
	 * @abstract
	 */
	get _cacheContextPrefix() {
		throw new Error("Must implement _cacheContextPrefix getter.");
	}

	/**
	 * Generates a fully qualified key for Redis.
	 * @param {string} identifier - The specific ID (e.g., userId, productId).
	 * @returns {string} The formatted key (e.g., "AUTH:refresh_token:123").
	 * @protected
	 */
	_getKey(identifier) {
		return `${this._cacheContextPrefix}:${identifier}`;
	}

	/**
	 * Stores a value in Redis with an optional expiration time.
	 * @param {string} identifier
	 * @param {string} value
	 * @param {number} [ttl] - Time to live in seconds.
	 * @returns {Promise<void>}
	 * @protected
	 */
	async _set(identifier, value, ttl) {
		const key = this._getKey(identifier);
		if (ttl) {
			await this.redis.set(key, value, "EX", ttl);
		} else {
			await this.redis.set(key, value);
		}
	}

	/**
	 * Retrieves a value from Redis.
	 * @param {string} identifier
	 * @returns {Promise<string | null>}
	 * @protected
	 */
	async _get(identifier) {
		const key = this._getKey(identifier);
		return this.redis.get(key);
	}

	/**
	 * Deletes a key from Redis.
	 * @param {string} identifier
	 * @returns {Promise<void>}
	 * @protected
	 */
	async _delete(identifier) {
		const key = this._getKey(identifier);
		await this.redis.del(key);
	}
}