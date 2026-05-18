import {IUserAccountService} from "../../interfaces/user/IUserAccountService.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {EmailNotificationService} from "../../application/services/notifications/EmailNotificationService.js";
import {PasswordService} from "../../infrastructure/security/PasswordService.js";
import {AuthResponseAssembler} from "../../domain/index.js";

import {JwtService} from "../../infrastructure/security/JwtService.js";
import {AuthCacheRepository} from "../../infrastructure/repositories/cache/AuthCacheRepository.js";

import {ActionNotAllowedError, EntityNotFoundError, InvalidCredentialsError} from "../../errors/index.js";

import {MS_PER_DAY, MS_PER_HOUR} from "../../constants/time.js";

/**
 * Implements the IUserAccountService contract, focusing on user account state
 * changes and associated email/token workflows.
 * @augments IUserAccountService
 */
export class UserAccountService extends IUserAccountService {
	/** @type {IUserService} */ #userService;
	/** @type {EmailNotificationService} */ #emailNotificationService;
	/** @type {PasswordService} */ #passwordProvider;
	/** @type {JwtService} */ #jwtProvider;
	/** @type {AuthCacheRepository} */ #authCacheRepository;
	/** @type {IUserTokenService} */ #userTokenService;
	/** @type {IUserMapper} */ #userMapper;

	/**
	 * @param {IUserService} userService
	 * @param {EmailNotificationService} emailNotificationService
	 * @param {PasswordService} passwordProvider
	 * @param {JwtService} jwtProvider
	 * @param {AuthCacheRepository} authCacheRepository
	 * @param {IUserTokenService} userTokenService
	 * @param {IUserMapper} userMapper
	 */
	constructor(
		userService,
		emailNotificationService,
		passwordProvider,
		jwtProvider,
		authCacheRepository,
		userTokenService,
		userMapper
	)
	{
		super();
		this.#userService = userService;
		this.#emailNotificationService = emailNotificationService;
		this.#passwordProvider = passwordProvider;
		this.#jwtProvider = jwtProvider;
		this.#authCacheRepository = authCacheRepository;
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
				this.#authCacheRepository.storeRefreshToken(userId, refreshToken),
				this.#emailNotificationService.sendEmailVerification(email, verificationToken)
			])
		);

		return AuthResponseAssembler.assembleUserWithTokens({ user: userDTO, accessToken, refreshToken });
	}

	async verifyEmail(token) {
		const userEntity = await this.#userTokenService.verifyUser(token);
		const { id: userId } = userEntity;

		const { accessToken, refreshToken } = this.#jwtProvider.generateTokens(userId);
		await this.#authCacheRepository.storeRefreshToken(userId, refreshToken);

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
		await this.#emailNotificationService.sendEmailVerification(email, verificationToken);

		return { message: "Verification code sent to your email" };
	}

	async forgotPassword(email) {
		try {
			const userEntity = await this.#userService.getEntityByEmailOrFail(email);
			const { id: userId } = userEntity;

			const { token: resetToken, expiresAt: resetPasswordTokenExpiresAt } = this.#generateResetTokenDetails();

			await this.#userTokenService.setResetPasswordToken(userId, resetToken, resetPasswordTokenExpiresAt);
			await this.#emailNotificationService.sendPasswordReset(email, resetToken);
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
				this.#authCacheRepository.storeRefreshToken(userId, refreshToken),
				this.#emailNotificationService.sendPasswordResetSuccess(email)
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

		const isMatch = await this.#passwordProvider.comparePassword(
			currentPassword, userEntityWithPassword.hashedPassword
		);
		if (!isMatch) {
			throw new InvalidCredentialsError("Current password is incorrect");
		}

		await this.#userService.changePassword(userEntityWithPassword, newPassword);
		await this.#authCacheRepository.invalidateAllSessions(userId);

		return { message: "Password changed successfully" };
	}
}