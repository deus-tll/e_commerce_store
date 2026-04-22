/**
 * @abstract
 * Base class for all specific cache services.
 * It encapsulates the connection to Cache Provider and common cache methods.
 */
export class BaseCacheService {
	/** @type {ICacheProvider} @protected */
	_cacheProvider;

	/**
	 * @param {ICacheProvider} cacheProvider
	 */
	constructor(cacheProvider) {
		this._cacheProvider = cacheProvider;
	}

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
	 * Generates a fully qualified key.
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
	 * Stores a value in Cache with an optional expiration time.
	 * @param {string} identifier
	 * @param {*} value
	 * @param {number} [ttl] - Time to live in seconds.
	 * @returns {Promise<void>}
	 * @protected
	 */
	async _set(identifier, value, ttl) {
		await this._cacheProvider.set(this._getKey(identifier), value, ttl);
	}

	/**
	 * Retrieves a value from Cache.
	 * @param {string} identifier
	 * @returns {Promise<string | null>}
	 * @protected
	 */
	async _get(identifier) {
		return await this._cacheProvider.get(this._getKey(identifier));
	}

	/**
	 * Deletes a key from Cache.
	 * @param {string} identifier
	 * @returns {Promise<void>}
	 * @protected
	 */
	async _delete(identifier) {
		await this._cacheProvider.delete(this._getKey(identifier));
	}
}