import {Request, Response} from "express";

import {SessionAuthService} from "../../application/auth/SessionAuthService.js";
import {UserAccountService} from "../../application/user/UserAccountService.js";
import {AuthCookieManager} from "../cookies/AuthCookieManager.js";

import {UserCreateInput} from "../../application/types/user.js";
import {
	ChangePasswordRequest,
	ForgotPasswordRequest, LoginRequest,
	ResetPasswordRequest,
	SignupRequest,
	VerifyEmailRequest
} from "../requests/auth.js";

import {UserRole} from "../../enums/application.js";

export class AuthController {
	constructor(
		private readonly sessionAuthService: SessionAuthService,
		private readonly userAccountService: UserAccountService,
		private readonly authCookieManager: AuthCookieManager
	) {}

	// ACCOUNT WORKFLOWS
	// ====================================================================

	signup = async (req: SignupRequest, res: Response): Promise<Response> => {
		const userCreateInput: UserCreateInput = {
			...req.body,
			role: UserRole.CUSTOMER,
			isVerified: false,
		} satisfies UserCreateInput;

		const { user, tokens } = await this.userAccountService.signup(userCreateInput);

		this.authCookieManager.setTokens(res, tokens.accessToken, tokens.refreshToken);

		return res.status(201).json(user);
	}

	verifyEmail = async (req: VerifyEmailRequest, res: Response): Promise<Response> => {
		const { code } = req.body;
		const { user, tokens } = await this.userAccountService.verifyEmail(code);

		this.authCookieManager.setTokens(res, tokens.accessToken, tokens.refreshToken);

		return res.status(200).json(user);
	}

	resendVerification = async (req: Request, res: Response): Promise<Response> => {
		const result = await this.userAccountService.resendVerificationEmail(req.user.id);
		return res.status(200).json(result);
	}

	forgotPassword = async (req: ForgotPasswordRequest, res: Response): Promise<Response> => {
		const { email } = req.body;
		const result = await this.userAccountService.forgotPassword(email);

		return res.status(200).json(result);
	}

	resetPassword = async (req: ResetPasswordRequest, res: Response): Promise<Response> => {
		const { token } = req.params;
		const { password } = req.body;

		const { user, tokens } = await this.userAccountService.resetPassword(token, password);

		this.authCookieManager.setTokens(res, tokens.accessToken, tokens.refreshToken);

		return res.status(200).json(user);
	}

	changePassword = async (req: ChangePasswordRequest, res: Response): Promise<Response> => {
		const { currentPassword, newPassword } = req.body;

		const result = await this.userAccountService.changePassword(
			req.user.id,
			currentPassword,
			newPassword
		);

		this.authCookieManager.clearTokens(res);

		return res.status(200).json(result);
	}

	// SESSION WORKFLOWS
	// ====================================================================

	login = async (req: LoginRequest, res: Response): Promise<Response> => {
		const { email, password } = req.body;
		const { user, tokens } = await this.sessionAuthService.login(email, password);

		this.authCookieManager.setTokens(res, tokens.accessToken, tokens.refreshToken);

		return res.status(200).json(user);
	}

	logout = async (req: Request, res: Response): Promise<Response> => {
		const { refreshToken } = req.cookies;
		await this.sessionAuthService.logout(refreshToken);

		this.authCookieManager.clearTokens(res);

		return res.status(204).end();
	}

	getProfile = async (req: Request, res: Response): Promise<Response> => {
		const user = await this.sessionAuthService.getProfile(req.user.id);
		return res.status(200).json(user);
	}

	refreshAccessToken = async (req: Request, res: Response): Promise<Response> => {
		const { refreshToken: oldRefreshToken } = req.cookies;

		try {
			const { accessToken, refreshToken: newRefreshToken } = await this.sessionAuthService.refreshAccessToken(oldRefreshToken);
			this.authCookieManager.setTokens(res, accessToken, newRefreshToken);

			return res.status(200).json({ message: "Tokens refreshed successfully" });
		}
		catch (error) {
			this.authCookieManager.clearTokens(res);
			throw error;
		}
	}
}