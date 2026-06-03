import {UserService} from "./UserService.js";
import {EmailNotificationService} from "../shared/notifications/EmailNotificationService.js";
import {PasswordService} from "../../infrastructure/security/PasswordService.js";

import {JwtService} from "../../infrastructure/security/JwtService.js";
import {AuthCacheRepository} from "../../infrastructure/repositories/cache/AuthCacheRepository.js";
import {UserTokenService} from "./UserTokenService.js";
import {UserMapper} from "./UserMapper.js";

import {UserCreateInput} from "../types/user.js";
import {AuthResponseAssembler, UserWithTokensDTO} from "../../domain/index.js";

import {ActionNotAllowedError, EntityNotFoundError, InvalidCredentialsError} from "../../errors/index.js";

import {MS_PER_DAY, MS_PER_HOUR} from "../../constants/time.js";

interface TokenResult {
	token: string;
	expiresAt: Date;
}

interface MessageResult {
	message: string;
}

export class UserAccountService {
	constructor(
		private readonly userService: UserService,
		private readonly emailNotificationService: EmailNotificationService,
		private readonly passwordService: PasswordService,
		private readonly jwtService: JwtService,
		private readonly authCacheRepository: AuthCacheRepository,
		private readonly userTokenService: UserTokenService,
	) {}

	/**
	 * Generates email verification token and calculates its expiration time.
	 */
	private generateVerificationTokenDetails(): TokenResult {
		const token = this.userTokenService.generateVerificationToken();
		const expiresAt = new Date(Date.now() + MS_PER_DAY);
		return { token, expiresAt };
	}

	/**
	 * Generates password reset token and calculates its expiration time.
	 */
	private generateResetTokenDetails(): TokenResult {
		const token = this.userTokenService.generateResetToken();
		const expiresAt = new Date(Date.now() + MS_PER_HOUR);
		return { token, expiresAt };
	}

	async signup(data: UserCreateInput): Promise<UserWithTokensDTO> {
		const userDTO = await this.userService.create(data);
		const { id: userId, email } = userDTO;

		const { token: verificationToken, expiresAt: verificationTokenExpiresAt } = this.generateVerificationTokenDetails();
		const { accessToken, refreshToken } = this.jwtService.generateTokens(userId);

		await this.userTokenService.setVerificationToken(userId, verificationToken, verificationTokenExpiresAt);

		await Promise.all(
			/** @type {Promise<any>[]} */ ([
				this.authCacheRepository.storeRefreshToken(userId, refreshToken),
				this.emailNotificationService.sendEmailVerification(email, verificationToken)
			])
		);

		return AuthResponseAssembler.assembleUserWithTokens({ user: userDTO, accessToken, refreshToken });
	}

	async verifyEmail(token: string): Promise<UserWithTokensDTO> {
		const userEntity = await this.userTokenService.verifyUser(token);
		const { id: userId } = userEntity;

		const { accessToken, refreshToken } = this.jwtService.generateTokens(userId);
		await this.authCacheRepository.storeRefreshToken(userId, refreshToken);

		return AuthResponseAssembler.assembleUserWithTokens({
			user: UserMapper.toDTO(userEntity),
			accessToken,
			refreshToken
		});
	}

	async resendVerificationEmail(userId: string): Promise<MessageResult> {
		const userEntity = await this.userService.getEntityByIdOrFail(userId);
		const { email, isVerified } = userEntity;

		if (isVerified) {
			throw new ActionNotAllowedError("Email is already verified");
		}

		const { token: verificationToken, expiresAt: verificationTokenExpiresAt } = this.generateVerificationTokenDetails();

		await this.userTokenService.setVerificationToken(userId, verificationToken, verificationTokenExpiresAt);
		await this.emailNotificationService.sendEmailVerification(email, verificationToken);

		return { message: "Verification code sent to your email" };
	}

	async forgotPassword(email: string): Promise<MessageResult> {
		try {
			const userEntity = await this.userService.getEntityByEmailOrFail(email);
			const { id: userId } = userEntity;

			const { token: resetToken, expiresAt: resetPasswordTokenExpiresAt } = this.generateResetTokenDetails();

			await this.userTokenService.setResetPasswordToken(userId, resetToken, resetPasswordTokenExpiresAt);
			await this.emailNotificationService.sendPasswordReset(email, resetToken);
		}
		catch (error) {
			if (!(error instanceof EntityNotFoundError)) {
				throw error;
			}
			console.info(`"Forgot password" requested for non-existent email: ${email}`);
		}

		return {
			message: "Password reset link sent to your email"
		};
	}

	async resetPassword(token: string, password: string): Promise<UserWithTokensDTO> {
		const userEntity = await this.userTokenService.resetPassword(token, password);
		const { id: userId, email } = userEntity;

		const { accessToken, refreshToken } = this.jwtService.generateTokens(userId);

		await Promise.all(
			/** @type {Promise<any>[]} */ ([
				this.authCacheRepository.storeRefreshToken(userId, refreshToken),
				this.emailNotificationService.sendPasswordResetSuccess(email)
			])
		);

		return AuthResponseAssembler.assembleUserWithTokens({
			user: UserMapper.toDTO(userEntity),
			accessToken, refreshToken
		});
	}

	async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<MessageResult> {
		const userEntityWithPassword = await this.userService.getEntityByIdOrFail(userId, {
			withPassword: true
		});

		const isMatch = await this.passwordService.comparePassword(
			currentPassword, userEntityWithPassword.hashedPassword
		);
		if (!isMatch) {
			throw new InvalidCredentialsError("Current password is incorrect");
		}

		await this.userService.changePassword(userEntityWithPassword, newPassword);
		await this.authCacheRepository.invalidateAllSessions(userId);

		return { message: "Password changed successfully" };
	}
}