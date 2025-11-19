import {ISessionAuthService} from "../interfaces/auth/ISessionAuthService.js";
import {IUserAccountService} from "../interfaces/user/IUserAccountService.js";
import {CreateUserDTO} from "../domain/index.js";

import {AuthCookieHandler} from "../http/cookies/AuthCookieHandler.js";

import {UserRoles} from "../utils/constants.js";

/**
 * Handles incoming HTTP requests related to user authentication and account management.
 * It manages cookie setting/clearing and delegates business logic to the appropriate services.
 */
export class AuthController {
	/** @type {ISessionAuthService} */ #sessionAuthService;
	/** @type {IUserAccountService} */ #userAccountService;
	/** @type {AuthCookieHandler} */ #authCookieHandler;

	/**
	 * @param {ISessionAuthService} sessionAuthService
	 * @param {IUserAccountService} userAccountService
	 * @param {AuthCookieHandler} authCookieHandler
	 */
	constructor(sessionAuthService, userAccountService, authCookieHandler) {
		this.#sessionAuthService = sessionAuthService;
		this.#userAccountService = userAccountService;
		this.#authCookieHandler = authCookieHandler;
	}

	// ACCOUNT WORKFLOWS (Delegated to #userAccountService)
	// ====================================================================

	/**
	 * Registers a new user.
	 * @param {object} req - Express request object. Expects name, email, and password in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 201 and the created UserDTO. Sets access/refresh tokens as cookies.
	 */
	signup = async (req, res, next) => {
		try {
			const { name, email, password } = req.body;

			const createUserDTO = new CreateUserDTO({
				name,
				email,
				password,
				role: UserRoles.CUSTOMER,
				isVerified: false,
			});

			const { user, tokens } = await this.#userAccountService.signup(createUserDTO);

			this.#authCookieHandler.setTokens(res, tokens.accessToken, tokens.refreshToken);

			return res.status(201).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Verifies the user's email address using a provided verification code.
	 * @param {object} req - Express request object. Expects 'code' in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the updated UserDTO. Sets new access/refresh tokens as cookies.
	 */
	verifyEmail = async (req, res, next) => {
		try {
			const { code } = req.body;
			const { user, tokens } = await this.#userAccountService.verifyEmail(code);

			this.#authCookieHandler.setTokens(res, tokens.accessToken, tokens.refreshToken);

			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Requests a new email verification link to be sent to the authenticated user.
	 * @param {object} req - Express request object. Reads 'userId' from req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a success message DTO.
	 */
	resendVerification = async (req, res, next) => {
		try {
			const result = await this.#userAccountService.resendVerificationEmail(req.userId);
			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Initiates the forgotten password flow by sending a password reset link to the user's email.
	 * @param {object} req - Express request object. Expects 'email' in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a success message DTO.
	 */
	forgotPassword = async (req, res, next) => {
		try {
			const { email } = req.body;
			const result = await this.#userAccountService.forgotPassword(email);

			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Resets the user's password using a valid reset token and logs the user in.
	 * @param {object} req - Express request object. Expects 'token' in req.params and 'password' in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the updated UserDTO. Sets new access/refresh tokens as cookies.
	 */
	resetPassword = async (req, res, next) => {
		try {
			const { token } = req.params;
			const { password } = req.body;

			const { user, tokens } = await this.#userAccountService.resetPassword(token, password);

			this.#authCookieHandler.setTokens(res, tokens.accessToken, tokens.refreshToken);

			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Allows an authenticated user to change their password, requiring both current and new passwords.
	 * Invalidates all existing sessions (clears cookies).
	 * @param {object} req - Express request object. Expects 'currentPassword' and 'newPassword' in req.body. Reads 'userId' from req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a success message DTO. Clears access and refresh token cookies.
	 */
	changePassword = async (req, res, next) => {
		try {
			const { currentPassword, newPassword } = req.body;

			const result = await this.#userAccountService.changePassword(
				req.userId,
				currentPassword,
				newPassword
			);

			this.#authCookieHandler.clearTokens(res);

			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	// SESSION WORKFLOWS (Delegated to #sessionAuthService)
	// ====================================================================

	/**
	 * Logs an existing user into the system.
	 * @param {object} req - Express request object. Expects email and password in req.body.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the UserDTO. Sets access/refresh tokens as cookies.
	 */
	login = async (req, res, next) => {
		try {
			const { email, password } = req.body;
			const { user, tokens } = await this.#sessionAuthService.login(email, password);

			this.#authCookieHandler.setTokens(res, tokens.accessToken, tokens.refreshToken);

			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Logs the user out by invalidating the refresh token and clearing cookies.
	 * @param {object} req - Express request object. Reads 'refreshToken' from req.cookies.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 204 (No Content). Clears access and refresh token cookies.
	 */
	logout = async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			await this.#sessionAuthService.logout(refreshToken);

			this.#authCookieHandler.clearTokens(res);

			return res.status(204).end();
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves the profile details of the authenticated user.
	 * @param {object} req - Express request object. Reads 'userId' from req.userId (set by auth middleware).
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the UserDTO.
	 */
	getProfile = async (req, res, next) => {
		try {
			const user = await this.#sessionAuthService.getProfile(req.userId);
			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Refreshes the access token using the valid refresh token from cookies.
	 * @param {object} req - Express request object. Reads 'refreshToken' from req.cookies.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a success message. Sets a new access token cookie.
	 */
	refreshAccessToken = async (req, res, next) => {
		try {
			const { refreshToken: oldRefreshToken } = req.cookies;

			const { accessToken, refreshToken: newRefreshToken } = await this.#sessionAuthService.refreshAccessToken(oldRefreshToken);

			this.#authCookieHandler.setTokens(res, accessToken, newRefreshToken);

			return res.status(200).json({ message: "Tokens refreshed successfully" });
		}
		catch (error) {
			next(error);
		}
	}
}