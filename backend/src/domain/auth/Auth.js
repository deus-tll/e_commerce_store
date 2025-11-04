import {UserDTO} from "../index.js";

/**
 * JWT-specific DTO for the response tokens.
 */
export class TokensDTO {
	/** @type {string} */ accessToken;
	/** @type {string} */ refreshToken;

	/**
	 * @param {string} accessToken
	 * @param {string} refreshToken
	 */
	constructor(accessToken, refreshToken) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}
}

/**
 * JWT-specific DTO for the combined user and token response.
 */
export class UserWithTokensDTO {
	/** @type {UserDTO} */ user;
	/** @type {TokensDTO} */ tokens;

	/**
	 * @param {UserDTO} user
	 * @param {TokensDTO} tokens
	 */
	constructor(user, tokens) {
		this.user = user;
		this.tokens = tokens;
	}
}

/**
 * JWT-specific DTO for the result of validating an access token.
 */
export class ValidateTokenDTO {
	/** @type {string} */ userId;
	/** @type {UserDTO} */ user;

	/**
	 * @param {string} userId
	 * @param {UserDTO} user
	 */
	constructor(userId, user) {
		this.userId = userId;
		this.user = user;
	}
}