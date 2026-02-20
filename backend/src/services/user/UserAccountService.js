import {IUserAccountService} from "../../interfaces/user/IUserAccountService.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {IEmailService} from "../../interfaces/email/IEmailService.js";
import {AuthResponseAssembler} from "../../domain/index.js";

import {JwtProvider} from "../../providers/JwtProvider.js";
import {AuthCacheService} from "../../cache/AuthCacheService.js";

import {ActionNotAllowedError, EntityNotFoundError, InvalidCredentialsError} from "../../errors/index.js";

import {EnvModes} from "../../constants/app.js";
import {MS_PER_DAY, MS_PER_HOUR} from "../../constants/time.js";
import {config} from "../../config.js";

const APP_URL =
	config.nodeEnv !== EnvModes.PROD
		? config.developmentClientUrl
		: config.appUrl;

/**
 * Implements the IUserAccountService contract, focusing on user account state
 * changes and associated email/token workflows.
 * @augments IUserAccountService
 */
export class UserAccountService extends IUserAccountService {
	/** @type {IUserService} */ #userService;
	/** @type {IEmailService} */ #emailService;
	/** @type {PasswordService} */ #passwordService;
	/** @type {JwtProvider} */ #jwtProvider;
	/** @type {AuthCacheService} */ #authCacheService;
	/** @type {IUserTokenService} */ #userTokenService;
	/** @type {IUserMapper} */ #userMapper;

	/**
	 * @param {IUserService} userService
	 * @param {IEmailService} emailService
	 * @param {PasswordService} passwordService
	 * @param {JwtProvider} jwtProvider
	 * @param {AuthCacheService} authCacheService
	 * @param {IUserTokenService} userTokenService
	 * @param {IUserMapper} userMapper
	 */
	constructor(userService, emailService, passwordService, jwtProvider, authCacheService, userTokenService, userMapper) {
		super();
		this.#userService = userService;
		this.#emailService = emailService;
		this.#passwordService = passwordService;
		this.#jwtProvider = jwtProvider;
		this.#authCacheService = authCacheService;
		this.#userTokenService = userTokenService;
		this.#userMapper = userMapper;
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
		const { id: userId, email } = userDTO;

		const { token: verificationToken, expiresAt: verificationTokenExpiresAt } = this.#generateVerificationTokenDetails();
		const { accessToken, refreshToken } = this.#jwtProvider.generateTokens(userId);

		await this.#userTokenService.setVerificationToken(userId, verificationToken, verificationTokenExpiresAt);

		await Promise.all(
			/** @type {Promise<any>[]} */ ([
				this.#authCacheService.storeRefreshToken(userId, refreshToken),
				this.#emailService.sendVerificationEmail(email, verificationToken)
			])
		);

		return AuthResponseAssembler.assembleUserWithTokens({ user: userDTO, accessToken, refreshToken });
	}

	async verifyEmail(token) {
		const userEntity = await this.#userTokenService.verifyUser(token);
		const { id: userId } = userEntity;

		const { accessToken, refreshToken } = this.#jwtProvider.generateTokens(userId);
		await this.#authCacheService.storeRefreshToken(userId, refreshToken);

		return AuthResponseAssembler.assembleUserWithTokens({
			user: this.#userMapper.toDTO(userEntity),
			accessToken,
			refreshToken
		});
	}

	async resendVerificationEmail(userId) {
		const userEntity = await this.#userService.getEntityByIdOrFail(userId);
		const { email, isVerified } = userEntity;

		if (isVerified) {
			throw new ActionNotAllowedError("Email is already verified");
		}

		const { token: verificationToken, expiresAt: verificationTokenExpiresAt } = this.#generateVerificationTokenDetails();

		await this.#userTokenService.setVerificationToken(userId, verificationToken, verificationTokenExpiresAt);
		await this.#emailService.sendVerificationEmail(email, verificationToken);

		return { message: "Verification code sent to your email" };
	}

	async forgotPassword(email) {
		try {
			const userEntity = await this.#userService.getEntityByEmailOrFail(email);
			const { id: userId } = userEntity;

			const { token: resetToken, expiresAt: resetPasswordTokenExpiresAt } = this.#generateResetTokenDetails();
			const resetPasswordUrl = `${APP_URL}/${config.auth.resetPasswordUrl}/${resetToken}`;

			await this.#userTokenService.setResetPasswordToken(userId, resetToken, resetPasswordTokenExpiresAt);
			await this.#emailService.sendPasswordResetEmail(email, resetPasswordUrl);
		}
		catch (error) {
			if (!(error instanceof EntityNotFoundError)) {
				throw error;
			}
			console.info(`Forgot password requested for non-existent email: ${email}`);
		}

		return {
			message: "Password reset link sent to your email"
		};
	}

	async resetPassword(token, password) {
		const userEntity = await this.#userTokenService.resetPassword(token, password);
		const { id: userId, email } = userEntity;

		const { accessToken, refreshToken } = this.#jwtProvider.generateTokens(userId);

		await Promise.all(
			/** @type {Promise<any>[]} */ ([
				this.#authCacheService.storeRefreshToken(userId, refreshToken),
				this.#emailService.sendPasswordResetSuccessEmail(email)
			])
		);

		return AuthResponseAssembler.assembleUserWithTokens({
			user: this.#userMapper.toDTO(userEntity),
			accessToken, refreshToken
		});
	}

	async changePassword(userId, currentPassword, newPassword) {
		const userEntityWithPassword = await this.#userService.getEntityByIdOrFail(userId, {
			withPassword: true
		});


		const isMatch = await this.#passwordService.comparePassword(
			currentPassword, userEntityWithPassword.hashedPassword
		);
		if (!isMatch) {
			throw new InvalidCredentialsError("Current password is incorrect");
		}

		await this.#userService.changePassword(userEntityWithPassword, newPassword);
		await this.#authCacheService.invalidateAllSessions(userId);

		return { message: "Password changed successfully" };
	}
}