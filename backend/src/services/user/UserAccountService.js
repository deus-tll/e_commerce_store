import {IUserAccountService} from "../../interfaces/user/IUserAccountService.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {IEmailService} from "../../interfaces/email/IEmailService.js";
import {AuthResponseAssembler} from "../../domain/index.js";

import {JwtProvider} from "../../providers/JwtProvider.js";
import {AuthCacheService} from "../../cache/AuthCacheService.js";

import {BadRequestError, InvalidCredentialsError} from "../../errors/apiErrors.js";

import {EnvModes} from "../../constants/app.js";
import {MS_PER_DAY, MS_PER_HOUR} from "../../constants/time.js";

const APP_URL =
	process.env.NODE_ENV !== EnvModes.PROD
		? process.env.DEVELOPMENT_CLIENT_URL
		: process.env.APP_URL;

/**
 * Implements the IUserAccountService contract, focusing on user account state
 * changes and associated email/token workflows.
 * @augments IUserAccountService
 */
export class UserAccountService extends IUserAccountService {
	/** @type {IUserService} */ #userService;
	/** @type {IEmailService} */ #emailService;
	/** @type {JwtProvider} */ #jwtProvider;
	/** @type {AuthCacheService} */ #authCacheService;
	/** @type {IUserTokenService} */ #userTokenService;

	/**
	 * @param {IUserService} userService
	 * @param {IEmailService} emailService
	 * @param {JwtProvider} jwtProvider
	 * @param {AuthCacheService} authCacheService
	 * @param {IUserTokenService} userTokenService
	 */
	constructor(userService, emailService, jwtProvider, authCacheService, userTokenService) {
		super();
		this.#userService = userService;
		this.#emailService = emailService;
		this.#jwtProvider = jwtProvider;
		this.#authCacheService = authCacheService;
		this.#userTokenService = userTokenService;
	}

	/**
	 * Generates email verification token and calculates its expiration time.
	 * @returns {{token: string, expiresAt: Date}}
	 */
	#generateVerificationTokenDetails() {
		const token = this.#userTokenService.generateVerificationToken();
		const expiresAt = Date.now() + MS_PER_DAY;
		return { token, expiresAt };
	}

	/**
	 * Generates password reset token and calculates its expiration time.
	 * @returns {{token: string, expiresAt: Date}}
	 */
	#generateResetTokenDetails() {
		const token = this.#userTokenService.generateResetToken();
		const expiresAt = Date.now() + MS_PER_HOUR;
		return { token, expiresAt };
	}

	async signup(data) {
		const userDTO = await this.#userService.create(data);
		const userId = userDTO.id;

		const { token: verificationToken, expiresAt: verificationTokenExpiresAt } = this.#generateVerificationTokenDetails();

		const { accessToken, refreshToken } = this.#jwtProvider.generateTokens(userId);

		await Promise.all(
			/** @type {Promise<any>[]} */ ([
				this.#userService.setVerificationToken(
					userId,
					verificationToken,
					verificationTokenExpiresAt
				),
				this.#authCacheService.storeRefreshToken(userId, refreshToken),
				this.#emailService.sendVerificationEmail(userDTO.email, verificationToken)
			])
		);

		return AuthResponseAssembler.assembleUserWithTokens({ user: userDTO, accessToken, refreshToken });
	}

	async verifyEmail(code) {
		const userDTO = await this.#userService.verify(code);
		const userId = userDTO.id;

		const { accessToken, refreshToken } = this.#jwtProvider.generateTokens(userId);
		await this.#authCacheService.storeRefreshToken(userId, refreshToken);

		return AuthResponseAssembler.assembleUserWithTokens({ user: userDTO, accessToken, refreshToken });
	}

	async resendVerificationEmail(userId) {
		const userDTO = await this.#userService.getByIdOrFail(userId);

		if (userDTO.isVerified) {
			throw new BadRequestError("Email is already verified");
		}

		const { token: verificationToken, expiresAt: verificationTokenExpiresAt } = this.#generateVerificationTokenDetails();

		await Promise.all(
			/** @type {Promise<any>[]} */ ([
				this.#userService.setVerificationToken(
					userId,
					verificationToken,
					verificationTokenExpiresAt
				),
				this.#emailService.sendVerificationEmail(userDTO.email, verificationToken)
			])
		);

		return { message: "Verification code sent to your email" };
	}

	async forgotPassword(email) {
		const userDTO = await this.#userService.getByEmailOrFail(email);

		const { token: resetToken, expiresAt: resetPasswordTokenExpiresAt } = this.#generateResetTokenDetails();

		const resetPasswordUrl = `${APP_URL}/reset-password/${resetToken}`;

		await Promise.all(
			/** @type {Promise<any>[]} */ ([
				this.#userService.setResetPasswordToken(
					userDTO.id,
					resetToken,
					resetPasswordTokenExpiresAt
				),
				this.#emailService.sendPasswordResetEmail(userDTO.email, resetPasswordUrl)
			])
		);

		return {
			message: "Password reset link sent to your email"
		};
	}

	async resetPassword(token, password) {
		const userDTO = await this.#userService.resetPassword(token, password);
		const userId = userDTO.id;

		const { accessToken, refreshToken } = this.#jwtProvider.generateTokens(userId);

		await Promise.all(
			/** @type {Promise<any>[]} */ ([
				this.#emailService.sendPasswordResetSuccessEmail(userDTO.email),
				this.#authCacheService.storeRefreshToken(userId, refreshToken)
			])
		);

		return AuthResponseAssembler.assembleUserWithTokens({ user: userDTO, accessToken, refreshToken });
	}

	async changePassword(userId, currentPassword, newPassword) {
		const userEntityWithPassword = await this.#userService.getEntityByIdOrFail(userId, {
			withPassword: true
		});

		const isMatch = await this.#userService.comparePassword(
			userEntityWithPassword.password,
			currentPassword
		);
		if (!isMatch) {
			throw new InvalidCredentialsError("Current password is incorrect");
		}

		await Promise.all(
			/** @type {Promise<any>[]} */ ([
				this.#userService.changePassword(userEntityWithPassword, newPassword),
				this.#authCacheService.invalidateAllSessions(userId)
			])
		);

		return { message: "Password changed successfully" };
	}
}