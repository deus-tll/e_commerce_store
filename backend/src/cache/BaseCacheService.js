import { redis } from "../infrastructure/redis.js";

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
		return identifier
			? `${this._cacheContextPrefix}:${identifier}`
			: this._cacheContextPrefix;
	}

	/**
	 * Stores a value in Redis with an optional expiration time.
	 * @param {string} identifier
	 * @param {*} value
	 * @param {number} [ttl] - Time to live in seconds.
	 * @returns {Promise<void>}
	 * @protected
	 */
	async _set(identifier, value, ttl) {
		const key = this._getKey(identifier);
		const data = typeof value === "string" ? value : JSON.stringify(value);

		if (ttl) {
			await this.redis.set(key, data, "EX", ttl);
		} else {
			await this.redis.set(key, data);
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
		const data = await this.redis.get(key);

		if (!data) return null;

		try {
			return JSON.parse(data);
		} catch {
			return data;
		}
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