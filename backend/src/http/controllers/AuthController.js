import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";
import {IUserAccountService} from "../../interfaces/user/IUserAccountService.js";
import {CreateUserDTO} from "../../domain/index.js";

import {AuthCookieManager} from "../cookies/AuthCookieManager.js";

import {UserRole} from "../../enums/application.ts";

/**
 * Handles incoming HTTP requests related to user authentication and account management.
 * It manages cookie setting/clearing and delegates business logic to the appropriate services.
 */
export class AuthController {
	/** @type {ISessionAuthService} */ #sessionAuthService;
	/** @type {IUserAccountService} */ #userAccountService;
	/** @type {AuthCookieManager} */ #authCookieManager;

	/**
	 * @param {ISessionAuthService} sessionAuthService
	 * @param {IUserAccountService} userAccountService
	 * @param {AuthCookieManager} authCookieManager
	 */
	constructor(sessionAuthService, userAccountService, authCookieManager) {
		this.#sessionAuthService = sessionAuthService;
		this.#userAccountService = userAccountService;
		this.#authCookieManager = authCookieManager;
	}

	// ACCOUNT WORKFLOWS
	// ====================================================================

	/**
	 * Registers a new user.
	 * @param {object} req - Express request object. Expects name, email, and password in req.body.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 201 and the created UserDTO. Sets access/refresh tokens as cookies.
	 */
	signup = async (req, res) => {
		const createUserDTO = new CreateUserDTO({
			...req.body,
			role: UserRole.CUSTOMER,
			isVerified: false,
		});

		const { user, tokens } = await this.#userAccountService.signup(createUserDTO);

		this.#authCookieManager.setTokens(res, tokens.accessToken, tokens.refreshToken);

		return res.status(201).json(user);
	}

	/**
	 * Verifies the user's email address using a provided verification code.
	 * @param {object} req - Express request object. Expects 'code' in req.body.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the updated UserDTO. Sets new access/refresh tokens as cookies.
	 */
	verifyEmail = async (req, res) => {
		const { code } = req.body;
		const { user, tokens } = await this.#userAccountService.verifyEmail(code);

		this.#authCookieManager.setTokens(res, tokens.accessToken, tokens.refreshToken);

		return res.status(200).json(user);
	}

	/**
	 * Requests a new email verification link to be sent to the authenticated user.
	 * @param {object} req - Express request object. Reads 'userId' from req.userId.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and a success message DTO.
	 */
	resendVerification = async (req, res) => {
		const result = await this.#userAccountService.resendVerificationEmail(req.userId);
		return res.status(200).json(result);
	}

	/**
	 * Initiates the forgotten password flow by sending a password reset link to the user's email.
	 * @param {object} req - Express request object. Expects 'email' in req.body.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and a success message DTO.
	 */
	forgotPassword = async (req, res) => {
		const { email } = req.body;
		const result = await this.#userAccountService.forgotPassword(email);

		return res.status(200).json(result);
	}

	/**
	 * Resets the user's password using a valid reset token and logs the user in.
	 * @param {object} req - Express request object. Expects 'token' in req.params and 'password' in req.body.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the updated UserDTO. Sets new access/refresh tokens as cookies.
	 */
	resetPassword = async (req, res) => {
		const { token } = req.params;
		const { password } = req.body;

		const { user, tokens } = await this.#userAccountService.resetPassword(token, password);

		this.#authCookieManager.setTokens(res, tokens.accessToken, tokens.refreshToken);

		return res.status(200).json(user);
	}

	/**
	 * Allows an authenticated user to change their password, requiring both current and new passwords.
	 * Invalidates all existing sessions (clears cookies).
	 * @param {object} req - Express request object. Expects 'currentPassword' and 'newPassword' in req.body. Reads 'userId' from req.userId.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and a success message DTO. Clears access and refresh token cookies.
	 */
	changePassword = async (req, res) => {
		const { currentPassword, newPassword } = req.body;

		const result = await this.#userAccountService.changePassword(
			req.userId,
			currentPassword,
			newPassword
		);

		this.#authCookieManager.clearTokens(res);

		return res.status(200).json(result);
	}

	// SESSION WORKFLOWS
	// ====================================================================

	/**
	 * Logs an existing user into the system.
	 * @param {object} req - Express request object. Expects email and password in req.body.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the UserDTO. Sets access/refresh tokens as cookies.
	 */
	login = async (req, res) => {
		const { email, password } = req.body;
		const { user, tokens } = await this.#sessionAuthService.login(email, password);

		this.#authCookieManager.setTokens(res, tokens.accessToken, tokens.refreshToken);

		return res.status(200).json(user);
	}

	/**
	 * Logs the user out by invalidating the refresh token and clearing cookies.
	 * @param {object} req - Express request object. Reads 'refreshToken' from req.cookies.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 204 (No Content). Clears access and refresh token cookies.
	 */
	logout = async (req, res) => {
		const { refreshToken } = req.cookies;
		await this.#sessionAuthService.logout(refreshToken);

		this.#authCookieManager.clearTokens(res);

		return res.status(204).end();
	}

	/**
	 * Retrieves the profile details of the authenticated user.
	 * @param {object} req - Express request object. Reads 'userId' from req.userId (set by auth middleware).
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and the UserDTO.
	 */
	getProfile = async (req, res) => {
		const user = await this.#sessionAuthService.getProfile(req.userId);
		return res.status(200).json(user);
	}

	/**
	 * Refreshes the access token using the valid refresh token from cookies.
	 * @param {object} req - Express request object. Reads 'refreshToken' from req.cookies.
	 * @param {object} res - Express response object.
	 * @returns {Promise<void>} - Responds with status 200 and a success message. Sets a new access token cookie.
	 */
	refreshAccessToken = async (req, res) => {
		const { refreshToken: oldRefreshToken } = req.cookies;

		try {
			const { accessToken, refreshToken: newRefreshToken } = await this.#sessionAuthService.refreshAccessToken(oldRefreshToken);
			this.#authCookieManager.setTokens(res, accessToken, newRefreshToken);
			return res.status(200).json({ message: "Tokens refreshed successfully" });
		}
		catch (error) {
			this.#authCookieManager.clearTokens(res);
			throw error;
		}
	}
}