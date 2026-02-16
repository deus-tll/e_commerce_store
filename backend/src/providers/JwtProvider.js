import jwt from "jsonwebtoken";

import {InvalidTokenError, TokenExpiredError} from "../errors/apiErrors.js";

import {TokenTypes} from "../constants/auth.js";
import {config} from "../config.js";

const ACCESS_TOKEN_SECRET = config.auth.accessTokenSecret;
const REFRESH_TOKEN_SECRET = config.auth.refreshTokenSecret;
const ACCESS_TOKEN_TTL = config.auth.accessTokenTtl;
const REFRESH_TOKEN_TTL = config.auth.refreshTokenTtl;

/**
 * Handles all technical JWT signing and verification details.
 */
export class JwtProvider {
	/**
	 * Signs an access token for the given user ID.
	 * @param {string} userId
	 * @returns {string}
	 */
	signAccessToken(userId) {
		return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
			expiresIn: ACCESS_TOKEN_TTL
		});
	}

	/**
	 * Signs a refresh token for the given user ID.
	 * @param {string} userId
	 * @returns {string}
	 */
	signRefreshToken(userId) {
		return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
			expiresIn: REFRESH_TOKEN_TTL
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
	 * @param {TokenTypes} type - The type of token being verified (Access or Refresh).
	 * @returns {object} - The decoded payload.
	 * @throws {TokenExpiredError|InvalidTokenError}
	 */
	verifyToken(token, type) {
		const secret = type === TokenTypes.ACCESS_TOKEN ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

		try {
			return jwt.verify(token, secret);
		}
		catch (error) {
			const tokenName = type === TokenTypes.ACCESS_TOKEN ? "Access token" : "Refresh token";

			if (error.name === 'TokenExpiredError') {
				throw new TokenExpiredError(`${tokenName} expired`);
			}

			throw new InvalidTokenError(`Invalid ${tokenName.toLowerCase()}`);
		}
	}
}