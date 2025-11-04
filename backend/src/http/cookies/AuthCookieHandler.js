import { IDateTimeService } from "../../interfaces/utils/IDateTimeService.js";
import { CookieTokenTypes, EnvModes, SameSiteCookieOptions } from "../../utils/constants.js";

const NODE_ENV = process.env.NODE_ENV;

const SAME_SITE_COOKIE_SETTER = NODE_ENV === EnvModes.PROD
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

		this.#ACCESS_TOKEN_COOKIE_MAX_AGE = this.#dateTimeService.ttlToMilliseconds(process.env.ACCESS_TOKEN_TTL);
		this.#REFRESH_TOKEN_COOKIE_MAX_AGE = this.#dateTimeService.ttlToMilliseconds(process.env.REFRESH_TOKEN_TTL);
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
			secure: NODE_ENV === EnvModes.PROD,
			sameSite: SAME_SITE_COOKIE_SETTER,
			maxAge: maxAge,
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
			secure: NODE_ENV === EnvModes.PROD,
			sameSite: SAME_SITE_COOKIE_SETTER
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