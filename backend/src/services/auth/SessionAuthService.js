import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {AuthResponseAssembler, ValidateTokenDTO} from "../../domain/index.js";

import {JwtProvider} from "../../providers/JwtProvider.js";
import {AuthCacheService} from "../../cache/AuthCacheService.js";

import {InvalidCredentialsError, InvalidTokenError, NotFoundError} from "../../errors/apiErrors.js";

import {TokenTypes} from "../../constants/auth.js";

/**
 * Implements the ISessionAuthService contract, focusing only on active user
 * session management (login, tokens, logout).
 */
export class SessionAuthService extends ISessionAuthService {
	/** @type {IUserService} */ #userService;
	/** @type {PasswordService} */ #passwordService;
	/** @type {JwtProvider} */ #jwtProvider;
	/** @type {AuthCacheService} */ #authCacheService;

	/**
	 * @param {IUserService} userService
	 * @param {PasswordService} passwordService
	 * @param {JwtProvider} jwtProvider
	 * @param {AuthCacheService} authCacheService
	 */
	constructor(userService, passwordService, jwtProvider, authCacheService) {
		super();
		this.#userService = userService;
		this.#passwordService = passwordService;
		this.#jwtProvider = jwtProvider;
		this.#authCacheService = authCacheService;
	}

	async login(email, password) {
		const userEntityWithPassword = await this.#userService.getEntityByEmailOrFail(email, {
			withPassword: true
		});

		const isMatch = await this.#passwordService.comparePassword(
			password, userEntityWithPassword.hashedPassword
		);
		if (!isMatch) {
			throw new InvalidCredentialsError("Invalid credentials");
		}

		const { id: userId } = userEntityWithPassword;
		const { accessToken, refreshToken } = this.#jwtProvider.generateTokens(userId);

		const userDTO = await this.#userService.updateLastLogin(userId);

		if (!userDTO) {
			throw new NotFoundError("User not found after login");
		}

		await this.#authCacheService.storeRefreshToken(userId, refreshToken)

		return AuthResponseAssembler.assembleUserWithTokens({ user: userDTO, accessToken, refreshToken });
	}

	async logout(refreshToken) {
		if (refreshToken) {
			try {
				const decoded = this.#jwtProvider.verifyToken(refreshToken, TokenTypes.REFRESH_TOKEN);
				await this.#authCacheService.removeRefreshToken(decoded.userId);
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

		let decoded;
		try {
			decoded = this.#jwtProvider.verifyToken(refreshToken, TokenTypes.REFRESH_TOKEN);
		} catch (error) {
			// If the token is simply invalid (e.g., malformed or expired), just fail.
			throw new InvalidTokenError("Invalid refresh token");
		}

		const { userId } = decoded;

		const [_, storedToken] = await Promise.all(
			/** @type {[UserDTO, string | null]} */ ([
				this.#userService.getByIdOrFail(userId),
				this.#authCacheService.getRefreshToken(userId)
			])
		);

		// 1. Reuse detection and invalidation
		if (!storedToken || storedToken !== refreshToken) {
			await this.#authCacheService.invalidateAllSessions(userId);
			throw new InvalidTokenError("Refresh token not found or revoked (Possible session hijacking)");
		}

		// 2. Token rotation
		const tokens = this.#jwtProvider.generateTokens(userId);
		await this.#authCacheService.storeRefreshToken(userId, tokens.refreshToken);

		return tokens;
	}
}