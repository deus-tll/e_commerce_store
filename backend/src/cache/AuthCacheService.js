import {BaseCacheService} from "./BaseCacheService.js";

import {CacheKeys} from "../utils/constants.js";
import {SECONDS_PER_DAY} from "../utils/timeConstants.js";

const REFRESH_TOKEN_CACHE_TTL = 7 * SECONDS_PER_DAY;

/**
 * Manages the storage and retrieval of auth related data in the cache (Redis).
 * @augments BaseCacheService
 */
export class AuthCacheService extends BaseCacheService {
	/**
	 * Defines the full, context-qualified prefix for this cache service's keys.
	 * @returns {string} The prefix, e.g., "AUTH:refresh_token".
	 * @protected
	 */
	get _cacheContextPrefix() {
		return `AUTH:${CacheKeys.REFRESH_TOKEN}`;
	}

	/**
	 * Stores a refresh token associated with a user ID.
	 * @param {string} userId
	 * @param {string} refreshToken
	 * @returns {Promise<void>}
	 */
	async storeRefreshToken(userId, refreshToken) {
		await this._set(userId, refreshToken, REFRESH_TOKEN_CACHE_TTL);
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