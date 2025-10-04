import {BadRequestError} from "../errors/apiErrors.js";
import {ttlToMilliseconds} from "../utils/timeUtils.js";

const SAME_SITE_COOKIE_SETTER = process.env.NODE_ENV === "production" ? "strict" : "lax";

const ACCESS_TOKEN_COOKIE_MAX_AGE = ttlToMilliseconds(process.env.ACCESS_TOKEN_TTL);
const REFRESH_TOKEN_COOKIE_MAX_AGE = ttlToMilliseconds(process.env.REFRESH_TOKEN_TTL);

/**
 * @typedef {import('../interfaces/IAuthService.js').IAuthService} IAuthService
 */

export class AuthController {
	/**
	 * @type {IAuthService}
	 */
	authService;

	/**
	 * @param {IAuthService} authService
	 */
	constructor(authService) {
		this.authService = authService;
	}

	#setCookieToken(maxAge) {
		return {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: SAME_SITE_COOKIE_SETTER,
			maxAge
		}
	}

	#setCookies(res, accessToken, refreshToken) {
		res.cookie("accessToken", accessToken, this.#setCookieToken(ACCESS_TOKEN_COOKIE_MAX_AGE));
		res.cookie("refreshToken", refreshToken, this.#setCookieToken(REFRESH_TOKEN_COOKIE_MAX_AGE));
	}

	#clearCookies(res) {
		res.clearCookie("accessToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: SAME_SITE_COOKIE_SETTER
		});
		res.clearCookie("refreshToken", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: SAME_SITE_COOKIE_SETTER
		});
	}

	signup = async (req, res, next) => {
		try {
			const { name, email, password } = req.body;

			if (!name?.trim() || !email?.trim() || !password) {
				throw new BadRequestError("Name, email and password are required");
			}

			const { user, tokens } = await this.authService.signup(name.trim(), email.trim(), password);

			this.#setCookies(res, tokens.accessToken, tokens.refreshToken);

			return res.status(201).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	login = async (req, res, next) => {
		try {
			const { email, password } = req.body;

			if (!email?.trim() || !password) {
				throw new BadRequestError("Email and password are required");
			}

			const { user, tokens } = await this.authService.login(email.trim(), password);

			this.#setCookies(res, tokens.accessToken, tokens.refreshToken);

			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	logout = async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			await this.authService.logout(refreshToken);

			this.#clearCookies(res);

			return res.status(204).end();
		}
		catch (error) {
			next(error);
		}
	}

	getProfile = async (req, res, next) => {
		try {
			const user = await this.authService.getProfile(req.user._id);
			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	refreshAccessToken = async (req, res, next) => {
		try {
			const { refreshToken } = req.cookies;
			const { accessToken } = await this.authService.refreshAccessToken(refreshToken);

			res.cookie("accessToken", accessToken, this.#setCookieToken(ACCESS_TOKEN_COOKIE_MAX_AGE));

			return res.status(200).json({ message: "Token refreshed successfully" });
		}
		catch (error) {
			next(error);
		}
	}

	verifyEmail = async (req, res, next) => {
		try {
			const { code } = req.body;

			if (!code?.trim()) {
				throw new BadRequestError("Verification code is required");
			}

			const { user, tokens } = await this.authService.verifyEmail(code.trim());

			this.#setCookies(res, tokens.accessToken, tokens.refreshToken);

			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	resendVerification = async (req, res, next) => {
		try {
			const result = await this.authService.resendVerificationEmail(req.user._id);
			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	forgotPassword = async (req, res, next) => {
		try {
			const { email } = req.body;

			if (!email?.trim()) {
				throw new BadRequestError("Email is required");
			}

			const result = await this.authService.forgotPassword(email.trim());

			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}

	resetPassword = async (req, res, next) => {
		try {
			const { token } = req.params;
			const { password } = req.body;

			if (!token?.trim()) {
				throw new BadRequestError("Reset token is required");
			}

			if (!password) {
				throw new BadRequestError("Password is required");
			}

			const { user, tokens } = await this.authService.resetPassword(token.trim(), password);

			this.#setCookies(res, tokens.accessToken, tokens.refreshToken);

			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	changePassword = async (req, res, next) => {
		try {
			const { currentPassword, newPassword } = req.body;

			if (!currentPassword || !newPassword) {
				throw new BadRequestError("Current password and new password are required");
			}

			const result = await this.authService.changePassword(
				req.user._id,
				currentPassword,
				newPassword
			);

			this.#clearCookies(res);

			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}
}