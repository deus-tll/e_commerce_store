import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";
import {UserService} from "../user/UserService.js";
import {PasswordService} from "../../infrastructure/security/PasswordService.js";
import {JwtService} from "../../infrastructure/security/JwtService.js";
import {AuthCacheRepository} from "../../infrastructure/repositories/cache/AuthCacheRepository.js";

import {UserDTO} from "../types/user.js";
import {AuthResponseAssembler, ValidateTokenDTO} from "../../domain/index.js";

import {InvalidCredentialsError, InvalidTokenError} from "../../errors/index.js";

import {TokenType} from "../../enums/auth.js";

/**
 * Implements the ISessionAuthService contract, focusing only on active user
 * session management (login, tokens, logout).
 */
export class SessionAuthService extends ISessionAuthService {
	/** @type {UserService} */ #userService;
	/** @type {PasswordService} */ #passwordProvider;
	/** @type {JwtService} */ #jwtProvider;
	/** @type {AuthCacheRepository} */ #authCacheRepository;

	/**
	 * @param {UserService} userService
	 * @param {PasswordService} passwordProvider
	 * @param {JwtService} jwtProvider
	 * @param {AuthCacheRepository} authCacheRepository
	 */
	constructor(userService, passwordProvider, jwtProvider, authCacheRepository) {
		super();
		this.#userService = userService;
		this.#passwordProvider = passwordProvider;
		this.#jwtProvider = jwtProvider;
		this.#authCacheRepository = authCacheRepository;
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

		await this.#authCacheRepository.storeRefreshToken(userId, refreshToken)

		return AuthResponseAssembler.assembleUserWithTokens({ user: userDTO, accessToken, refreshToken });
	}

	async logout(refreshToken) {
		if (refreshToken) {
			try {
				const decoded = this.#jwtProvider.verifyToken(refreshToken, TokenType.REFRESH_TOKEN);
				await this.#authCacheRepository.removeRefreshToken(decoded.userId);
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
		const decoded = this.#jwtProvider.verifyToken(token, TokenType.ACCESS_TOKEN);
		const userDTO = await this.#userService.getByIdOrFail(decoded.userId);

		return new ValidateTokenDTO(decoded.userId, userDTO);
	}

	async refreshAccessToken(refreshToken) {
		if (!refreshToken) {
			throw new InvalidTokenError("No refresh token provided");
		}

		const decoded = this.#jwtProvider.verifyToken(refreshToken, TokenType.REFRESH_TOKEN);

		const { userId } = decoded;

		const [_, storedToken] = await Promise.all(
			/** @type {[UserDTO, string | null]} */ ([
				this.#userService.getByIdOrFail(userId),
				this.#authCacheRepository.getRefreshToken(userId)
			])
		);

		// 1. Reuse detection and invalidation
		if (!storedToken || storedToken !== refreshToken) {
			await this.#authCacheRepository.invalidateAllSessions(userId);
			throw new InvalidTokenError("Refresh token not found or revoked (Possible session hijacking)");
		}

		// 2. Token rotation
		const tokens = this.#jwtProvider.generateTokens(userId);
		await this.#authCacheRepository.storeRefreshToken(userId, tokens.refreshToken);

		return tokens;
	}
}