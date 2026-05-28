import {InvalidTokenError, TokenExpiredError} from "../../errors/index.js";

import {TokenType} from "../../enums/auth.ts";

/**
 * Handles all technical JWT signing and verification details.
 */
export class JwtService {
	/** @type {import("jsonwebtoken")} */ #jwt;
	/** @type {string} */ #accessTokenSecret;
	/** @type {string} */ #accessTokenTtl;
	/** @type {string} */ #refreshTokenSecret;
	/** @type {string} */ #refreshTokenTtl;

	/**
	 * @param {import("jsonwebtoken")} jwt
	 * @param {string} accessTokenSecret
	 * @param {string} accessTokenTtl
	 * @param {string} refreshTokenSecret
	 * @param {string} refreshTokenTtl
	 */
	constructor(jwt, accessTokenSecret, accessTokenTtl, refreshTokenSecret, refreshTokenTtl) {
		this.#jwt = jwt;
		this.#accessTokenSecret = accessTokenSecret;
		this.#accessTokenTtl = accessTokenTtl;
		this.#refreshTokenSecret = refreshTokenSecret;
		this.#refreshTokenTtl = refreshTokenTtl;
	}

	/**
	 * Signs an access token for the given user ID.
	 * @param {string} userId
	 * @returns {string}
	 */
	signAccessToken(userId) {
		return this.#jwt.sign({ userId }, this.#accessTokenSecret, {
			expiresIn: this.#accessTokenTtl
		});
	}

	/**
	 * Signs a refresh token for the given user ID.
	 * @param {string} userId
	 * @returns {string}
	 */
	signRefreshToken(userId) {
		return this.#jwt.sign({ userId }, this.#refreshTokenSecret, {
			expiresIn: this.#refreshTokenTtl
		});
	}

	/**
	 * Generates both an access token and a refresh token.
	 * @param {string} userId
	 * @returns {{accessToken: string, refreshToken: string}}
	 */
	generateTokens(userId) {
		const accessToken = this.signAccessToken(userId);
		const refreshToken = this.signRefreshToken(userId);
		return { accessToken, refreshToken };
	}

	/**
	 * Verifies a token and handles JWT-specific errors.
	 * @param {string} token
	 * @param {TokenType} type - The type of token being verified (Access or Refresh).
	 * @returns {object} - The decoded payload.
	 * @throws {TokenExpiredError|InvalidTokenError}
	 */
	verifyToken(token, type) {
		const secret = type === TokenType.ACCESS_TOKEN ? this.#accessTokenSecret : this.#refreshTokenSecret;

		try {
			return this.#jwt.verify(token, secret);
		}
		catch (error) {
			const tokenName = type === TokenType.ACCESS_TOKEN ? "Access token" : "Refresh token";

			if (error.name === 'TokenExpiredError') {
				throw new TokenExpiredError(`${tokenName} expired`);
			}

			throw new InvalidTokenError(`Invalid ${tokenName.toLowerCase()}`);
		}
	}
}