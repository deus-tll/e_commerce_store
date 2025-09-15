import {AuthService} from "../services/AuthService.js";

const SAME_SITE_COOKIE_SETTER = process.env.NODE_ENV === "production" ? "strict" : "lax";

export class AuthController {
	constructor() {
		this.authService = new AuthService();
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
		res.cookie("accessToken", accessToken, this.#setCookieToken(15 * 60 * 1000));
		res.cookie("refreshToken", refreshToken, this.#setCookieToken(7 * 24 * 60 * 60 * 1000));
	}

	signup = async (req, res, next) => {
		try {
			const { name, email, password } = req.body;
			const { user, tokens } = await this.authService.signup(name, email, password);

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
			const { user, tokens } = await this.authService.login(email, password);

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

			res.clearCookie("accessToken");
			res.clearCookie("refreshToken");
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

			res.cookie("accessToken", accessToken, this.#setCookieToken(15 * 60 * 1000));
			return res.status(200).json({ message: "Token refreshed successfully" });
		}
		catch (error) {
			next(error);
		}
	}

	verifyEmail = async (req, res, next) => {
		try {
			const { code } = req.body;
			const { user, tokens } = await this.authService.verifyEmail(code);

			this.#setCookies(res, tokens.accessToken, tokens.refreshToken);

			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}

	forgotPassword = async (req, res, next) => {
		try {
			const { email } = req.body;
			const result = await this.authService.forgotPassword(email);

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
			const { user, tokens } = await this.authService.resetPassword(token, password);

			this.#setCookies(res, tokens.accessToken, tokens.refreshToken);

			return res.status(200).json(user);
		}
		catch (error) {
			next(error);
		}
	}
}