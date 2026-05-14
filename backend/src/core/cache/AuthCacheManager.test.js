import { describe, it, expect, beforeEach } from "vitest";

import {AuthCacheManager} from "./AuthCacheManager.js";
import {ICacheProvider} from "../../infrastructure/providers/cache/ICacheProvider.js";

import {createMockFromInterface} from "../../tests/utils/mockFactory.js";

import {SECONDS_PER_DAY} from "../../constants/time.js";
import {CacheKeys, PrefixCacheKeys} from "../../constants/app.js";

describe("AuthCacheManager", () => {
    let mockCacheProvider;
    let authCacheManager;

    const REFRESH_TOKEN_TTL = "7d";
    const TTL_IN_SECONDS = 7 * SECONDS_PER_DAY;
    const USER_ID = "user-123";
    const TOKEN = "fake-refresh-token";

    const EXPECTED_KEY = `${PrefixCacheKeys.AUTH}:${CacheKeys.REFRESH_TOKEN}:${USER_ID}`;

    beforeEach(() => {
        mockCacheProvider = createMockFromInterface(ICacheProvider);

        authCacheManager = new AuthCacheManager(
            mockCacheProvider,
            REFRESH_TOKEN_TTL
        );
    });

    it("should store refresh token with correct key and TTL", async () => {
        await authCacheManager.storeRefreshToken(USER_ID, TOKEN);

        expect(mockCacheProvider.set).toHaveBeenCalledWith(
            EXPECTED_KEY,
            TOKEN,
            TTL_IN_SECONDS
        );
    });

    it("should retrieve refresh token for a given user", async () => {
        mockCacheProvider.get.mockResolvedValue(TOKEN);

        const result = await authCacheManager.getRefreshToken(USER_ID);

        expect(result).toBe(TOKEN);
        expect(mockCacheProvider.get).toHaveBeenCalledWith(EXPECTED_KEY);
    });

    it("should remove refresh token (invalidate session)", async () => {
        await authCacheManager.removeRefreshToken(USER_ID);

        expect(mockCacheProvider.delete).toHaveBeenCalledWith(EXPECTED_KEY);
    });
});