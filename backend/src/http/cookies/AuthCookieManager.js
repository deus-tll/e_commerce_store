import {DateTime} from "../../utils/dateTime.js";
import {CookieTokenType, SameSiteCookieOption} from "../../enums/auth.ts";

export class AuthCookieManager {
	/** @type {boolean} */ #isProduction;
	/** @type {boolean} */ #forceDisableSecureCookies;
	/** @type {string} */ #sameSite;
	/** @type {number} */ #accessTokenMaxAge;
	/** @type {number} */ #refreshTokenMaxAge;

	/**
	 * @param {string} refreshTokenTtl
	 * @param {boolean} isProduction
	 * @param {boolean} forceDisableSecureCookies
	 */
	constructor(refreshTokenTtl, isProduction, forceDisableSecureCookies) {
		this.#isProduction = isProduction;
		this.#forceDisableSecureCookies = forceDisableSecureCookies;

		// Access cookie lifetime matches refresh cookie lifetime
		// (not to confuse with jwt ttl for access and refresh, they are different).
		// This is to prevent browser from invalidating access token and
		// not including it in the request, when it should be
		const ttlMs = DateTime.ttlToMilliseconds(refreshTokenTtl);
		this.#accessTokenMaxAge = ttlMs;
		this.#refreshTokenMaxAge = ttlMs;

		this.#sameSite = (this.#isProduction && !forceDisableSecureCookies)
			? SameSiteCookieOption.NONE
			: SameSiteCookieOption.LAX;
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
			secure: this.#forceDisableSecureCookies ? false : this.#isProduction,
			sameSite: this.#sameSite,
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
			secure: this.#forceDisableSecureCookies ? false : this.#isProduction,
			sameSite: this.#sameSite,
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
		res.cookie(CookieTokenType.ACCESS_TOKEN, accessToken, this.#getCookieOptions(this.#accessTokenMaxAge));
	}

	/**
	 * Sets only the refresh token as an HTTP-only cookie on the response object.
	 * @param {object} res - Express response object.
	 * @param {string} refreshToken
	 * @returns {void}
	 */
	setRefreshToken(res, refreshToken) {
		res.cookie(CookieTokenType.REFRESH_TOKEN, refreshToken, this.#getCookieOptions(this.#refreshTokenMaxAge));
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

		res.clearCookie(CookieTokenType.ACCESS_TOKEN, baseOptions);
		res.clearCookie(CookieTokenType.REFRESH_TOKEN, baseOptions);
	}
}