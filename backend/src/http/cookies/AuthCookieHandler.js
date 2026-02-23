import {IDateTimeService} from "../../interfaces/utils/IDateTimeService.js";

import {EnvModes} from "../../constants/app.js";
import {CookieTokenTypes, SameSiteCookieOptions} from "../../constants/auth.js";

import {config} from "../../config.js";

const IS_PROD = config.app.nodeEnv === EnvModes.PROD;

const SAME_SITE_COOKIE_SETTER = IS_PROD
	? SameSiteCookieOptions.STRICT
	: SameSiteCookieOptions.LAX;

export class AuthCookieHandler {
	/** @type {IDateTimeService} */ #dateTimeService;
	/** @type {number} */ #ACCESS_TOKEN_COOKIE_MAX_AGE;
	/** @type {number} */ #REFRESH_TOKEN_COOKIE_MAX_AGE;

	/**
	 * @param {IDateTimeService} dateTimeService
	 */
	constructor(dateTimeService) {
		this.#dateTimeService = dateTimeService;

		// Access cookie lifetime matches refresh cookie lifetime
		// (not to confuse with jwt ttl for access and refresh, they are different).
		// This is to prevent browser from invalidating access token and
		// not including it in the request, when it should be
		const tokenTTL = process.env.REFRESH_TOKEN_TTL;

		this.#ACCESS_TOKEN_COOKIE_MAX_AGE = this.#dateTimeService.ttlToMilliseconds(tokenTTL);
		this.#REFRESH_TOKEN_COOKIE_MAX_AGE = this.#dateTimeService.ttlToMilliseconds(tokenTTL);
	}

	/**
	 * Helper to configure standard HTTP-only cookie options.
	 * @private
	 * @param {number} maxAge - Max age in milliseconds (optional, defaults to session for clearing).
	 * @returns {object}
	 */
	#getCookieOptions(maxAge) {
		// All our auth tokens must be HTTP-only and secure in production
		return {
			httpOnly: true,
			secure: IS_PROD,
			sameSite: SAME_SITE_COOKIE_SETTER,
			maxAge: maxAge,
			path: "/"
		}
	}

	/**
	 * Returns the base options required when clearing a cookie (must match settings used when setting it).
	 * @private
	 * @returns {object}
	 */
	#getBaseClearOptions() {
		return {
			httpOnly: true,
			secure: IS_PROD,
			sameSite: SAME_SITE_COOKIE_SETTER,
			path: "/"
		};
	}

	/**
	 * Sets only the access token as an HTTP-only cookie on the response object.
	 * @param {object} res - Express response object.
	 * @param {string} accessToken
	 * @returns {void}
	 */
	setAccessToken(res, accessToken) {
		res.cookie(CookieTokenTypes.ACCESS_TOKEN, accessToken, this.#getCookieOptions(this.#ACCESS_TOKEN_COOKIE_MAX_AGE));
	}

	/**
	 * Sets only the refresh token as an HTTP-only cookie on the response object.
	 * @param {object} res - Express response object.
	 * @param {string} refreshToken
	 * @returns {void}
	 */
	setRefreshToken(res, refreshToken) {
		res.cookie(CookieTokenTypes.REFRESH_TOKEN, refreshToken, this.#getCookieOptions(this.#REFRESH_TOKEN_COOKIE_MAX_AGE));
	}

	/**
	 * Sets access and refresh tokens as HTTP-only cookies on the response object.
	 * @param {object} res - Express response object.
	 * @param {string} accessToken
	 * @param {string} refreshToken
	 * @returns {void}
	 */
	setTokens(res, accessToken, refreshToken) {
		this.setAccessToken(res, accessToken);
		this.setRefreshToken(res, refreshToken);
	}

	/**
	 * Clears access and refresh tokens from the response cookies.
	 * @param {object} res - Express response object.
	 * @returns {void}
	 */
	clearTokens(res) {
		const baseOptions = this.#getBaseClearOptions();

		res.clearCookie(CookieTokenTypes.ACCESS_TOKEN, baseOptions);
		res.clearCookie(CookieTokenTypes.REFRESH_TOKEN, baseOptions);
	}
}