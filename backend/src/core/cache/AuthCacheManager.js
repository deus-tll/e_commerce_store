import {BaseCacheManager} from "./BaseCacheManager.js";

import {DateTime} from "../../utils/dateTime.js";
import {CacheKeys, PrefixCacheKeys} from "../../constants/app.js";

/**
 * Manages the storage and retrieval of auth related data in the cache.
 * @augments BaseCacheManager
 */
export class AuthCacheManager extends BaseCacheManager {
	/** @type {number} */ #refreshTokenTtlInSeconds;

	/**
	 * @param {ICacheProvider} cacheProvider
	 * @param {string} refreshTokenTtl
	 */
	constructor(cacheProvider, refreshTokenTtl) {
		super(cacheProvider);
		this.#refreshTokenTtlInSeconds = DateTime.ttlToSeconds(refreshTokenTtl);
	}

	/**
	 * Defines the full, context-qualified prefix for this cache service's keys.
	 * @returns {string} The prefix, e.g., "AUTH:refresh_token".
	 * @protected
	 */
	get _cacheContextPrefix() {
		return `${PrefixCacheKeys.AUTH}:${CacheKeys.REFRESH_TOKEN}`;
	}

	/**
	 * Stores a refresh token associated with a user ID.
	 * @param {string} userId
	 * @param {string} refreshToken
	 * @returns {Promise<void>}
	 */
	async storeRefreshToken(userId, refreshToken) {
		await this._set(userId, refreshToken, this.#refreshTokenTtlInSeconds);
	}

	/**
	 * Retrieves the refresh token stored for a user ID.
	 * @param {string} userId
	 * @returns {Promise<string | null>}
	 */
	async getRefreshToken(userId) {
		return this._get(userId);
	}

	/**
	 * Removes the stored refresh token for a user ID (Invalidates session).
	 * @param {string} userId
	 * @returns {Promise<void>}
	 */
	async removeRefreshToken(userId) {
		await this._delete(userId);
	}

	/**
	 * Invalidates all current user sessions by deleting the stored refresh token.
	 * @param {string} userId
	 * @returns {Promise<void>}
	 */
	async invalidateAllSessions(userId) {
		await this.removeRefreshToken(userId);
	}
}