import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {PasswordService} from "../../infrastructure/security/PasswordService.js";
import {AuthResponseAssembler, ValidateTokenDTO} from "../../domain/index.js";

import {JwtProvider} from "../../providers/auth/JwtProvider.js";
import {AuthCacheManager} from "../../core/cache/AuthCacheManager.js";

import {InvalidCredentialsError, InvalidTokenError} from "../../errors/index.js";

import {TokenTypes} from "../../constants/auth.js";

/**
 * Implements the ISessionAuthService contract, focusing only on active user
 * session management (login, tokens, logout).
 */
export class SessionAuthService extends ISessionAuthService {
	/** @type {IUserService} */ #userService;
	/** @type {PasswordService} */ #passwordProvider;
	/** @type {JwtProvider} */ #jwtProvider;
	/** @type {AuthCacheManager} */ #authCacheManager;

	/**
	 * @param {IUserService} userService
	 * @param {PasswordService} passwordProvider
	 * @param {JwtProvider} jwtProvider
	 * @param {AuthCacheManager} authCacheManager
	 */
	constructor(userService, passwordProvider, jwtProvider, authCacheManager) {
		super();
		this.#userService = userService;
		this.#passwordProvider = passwordProvider;
		this.#jwtProvider = jwtProvider;
		this.#authCacheManager = authCacheManager;
	}

	async login(email, password) {
		const userEntityWithPassword = await this.#userService.getEntityByEmailOrFail(email, {
			withPassword: true
		});

		const isMatch = await this.#passwordProvider.comparePassword(
			password, userEntityWithPassword.hashedPassword
		);
		if (!isMatch) {
			throw new InvalidCredentialsError("Invalid credentials");
		}

		const { id: userId } = userEntityWithPassword;
		const { accessToken, refreshToken } = this.#jwtProvider.generateTokens(userId);

		const userDTO = await this.#userService.updateLastLogin(userId);

		await this.#authCacheManager.storeRefreshToken(userId, refreshToken)

		return AuthResponseAssembler.assembleUserWithTokens({ user: userDTO, accessToken, refreshToken });
	}

	async logout(refreshToken) {
		if (refreshToken) {
			try {
				const decoded = this.#jwtProvider.verifyToken(refreshToken, TokenTypes.REFRESH_TOKEN);
				await this.#authCacheManager.removeRefreshToken(decoded.userId);
			}
			catch (error) {
				console.warn("Invalid refresh token during logout:", error.message);
			}
		}
	}

	async getProfile(userId) {
		return await this.#userService.getByIdOrFail(userId);
	}

	async validateAccessToken(token) {
		const decoded = this.#jwtProvider.verifyToken(token, TokenTypes.ACCESS_TOKEN);
		const userDTO = await this.#userService.getByIdOrFail(decoded.userId);

		return new ValidateTokenDTO(decoded.userId, userDTO);
	}

	async refreshAccessToken(refreshToken) {
		if (!refreshToken) {
			throw new InvalidTokenError("No refresh token provided");
		}

		const decoded = this.#jwtProvider.verifyToken(refreshToken, TokenTypes.REFRESH_TOKEN);

		const { userId } = decoded;

		const [_, storedToken] = await Promise.all(
			/** @type {[UserDTO, string | null]} */ ([
				this.#userService.getByIdOrFail(userId),
				this.#authCacheManager.getRefreshToken(userId)
			])
		);

		// 1. Reuse detection and invalidation
		if (!storedToken || storedToken !== refreshToken) {
			await this.#authCacheManager.invalidateAllSessions(userId);
			throw new InvalidTokenError("Refresh token not found or revoked (Possible session hijacking)");
		}

		// 2. Token rotation
		const tokens = this.#jwtProvider.generateTokens(userId);
		await this.#authCacheManager.storeRefreshToken(userId, tokens.refreshToken);

		return tokens;
	}
}