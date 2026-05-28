import {BaseCacheRepository} from "./BaseCacheRepository.js";
import {ICacheProvider} from "../../providers/cache/ICacheProvider.js";

import {CacheKey, PrefixCacheKey} from "../../../enums/application.js";

import {DateTime} from "../../../utils/dateTime.js";

export class AuthCacheRepository extends BaseCacheRepository {
	private readonly refreshTokenTtlInSeconds: number;

	constructor(cacheProvider: ICacheProvider, refreshTokenTtl: string) {
		super(cacheProvider);
		this.refreshTokenTtlInSeconds = DateTime.ttlToSeconds(refreshTokenTtl);
	}

	protected override get cacheContextPrefix(): string {
		return `${PrefixCacheKey.AUTH}:${CacheKey.REFRESH_TOKEN}`;
	}

	async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
		await this.set(userId, refreshToken, this.refreshTokenTtlInSeconds);
	}

	async getRefreshToken(userId: string): Promise<string | null> {
		return this.get<string>(userId);
	}

	/**
	 * Removes the stored refresh token for a user (Invalidates session).
	 */
	async removeRefreshToken(userId: string): Promise<void> {
		await this.delete(userId);
	}

	/**
	 * Invalidates all current user's sessions.
	 */
	async invalidateAllSessions(userId: string): Promise<void> {
		// Logic for when multiple sessions are implemented goes here.
		// For now, it's just current session invalidation
		await this.removeRefreshToken(userId);
	}
}