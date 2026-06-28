import {describe, it, expect, beforeEach, Mocked} from "vitest";

import {AuthCacheRepository} from "../AuthCacheRepository.js";
import {ICacheProvider} from "../../../providers/cache/ICacheProvider.js";

import {CacheKey, PrefixCacheKey} from "../../../../enums/application.js";
import {SECONDS_PER_DAY} from "../../../../constants/time.js";

import {createMock} from "../../../../tests/utils/createMock.js";

describe("AuthCacheRepository", () => {
    let mockCacheProvider: Mocked<ICacheProvider>;
    let authCacheRepository: AuthCacheRepository;

    const REFRESH_TOKEN_TTL = "7d";
    const TTL_IN_SECONDS = 7 * SECONDS_PER_DAY;
    const USER_ID = "user-123";
    const TOKEN = "fake-refresh-token";

    const EXPECTED_KEY = `${PrefixCacheKey.AUTH}:${CacheKey.REFRESH_TOKEN}:${USER_ID}`;

    beforeEach(() => {
        mockCacheProvider = createMock<ICacheProvider>();

        authCacheRepository = new AuthCacheRepository(
            mockCacheProvider,
            REFRESH_TOKEN_TTL
        );
    });

    it("should store refresh token with correct key and TTL", async () => {
        await authCacheRepository.storeRefreshToken(USER_ID, TOKEN);

        expect(mockCacheProvider.set).toHaveBeenCalledWith(
            EXPECTED_KEY,
            TOKEN,
            TTL_IN_SECONDS
        );
    });

    it("should retrieve refresh token for a given user", async () => {
        mockCacheProvider.get.mockResolvedValue(TOKEN);

        const result = await authCacheRepository.getRefreshToken(USER_ID);

        expect(result).toBe(TOKEN);
        expect(mockCacheProvider.get).toHaveBeenCalledWith(EXPECTED_KEY);
    });

    it("should remove refresh token (invalidate session)", async () => {
        await authCacheRepository.removeRefreshToken(USER_ID);

        expect(mockCacheProvider.delete).toHaveBeenCalledWith(EXPECTED_KEY);
    });
});