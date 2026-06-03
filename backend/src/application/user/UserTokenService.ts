import crypto from "crypto";

import {IUserRepository} from "./IUserRepository.js";
import {PasswordService} from "../../infrastructure/security/PasswordService.js";

import {UserEntity} from "../../entities/user/UserEntity.js";
import {UserUpdatePersistence} from "../types/user.js";

import {DomainValidationError} from "../../errors/index.js";

export class UserTokenService {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly passwordProvider: PasswordService
	) {}

	generateVerificationToken(): string {
		return crypto.randomInt(100000, 1000000).toString();
	}

	generateResetToken(): string {
		return crypto.randomUUID();
	}

	async setVerificationToken(userId: string, token: string, expiresAt: Date): Promise<UserEntity> {
		const updateData: UserUpdatePersistence = Object.freeze({
			verificationToken: token,
			verificationTokenExpiresAt: expiresAt
		} satisfies UserUpdatePersistence);

		return await this.userRepository.updateById(userId, updateData);
	}

	async verifyUser(token: string): Promise<UserEntity> {
		const entity = await this.userRepository.findByValidVerificationToken(token);

		if (!entity) {
			throw new DomainValidationError("Invalid or expired verification token");
		}

		const updateData: UserUpdatePersistence = Object.freeze({
			isVerified: true,
			verificationToken: null,
			verificationTokenExpiresAt: null
		} satisfies UserUpdatePersistence);

		return await this.userRepository.updateById(entity.id, updateData);
	}

	async setResetPasswordToken(userId: string, token: string, expiresAt: Date): Promise<UserEntity> {
		const updateData: UserUpdatePersistence = Object.freeze({
			resetPasswordToken: token,
			resetPasswordTokenExpiresAt: expiresAt
		} satisfies UserUpdatePersistence);

		return await this.userRepository.updateById(userId, updateData);
	}

	async resetPassword(token: string, newPassword: string): Promise<UserEntity> {
		const entity = await this.userRepository.findByValidResetToken(token);
		if (!entity) throw new DomainValidationError("Invalid or expired reset token");

		const hashedPassword = await this.passwordProvider.hashPassword(newPassword);

		const updateData: UserUpdatePersistence = Object.freeze({
			password: hashedPassword,
			resetPasswordToken: null,
			resetPasswordTokenExpiresAt: null
		} satisfies UserUpdatePersistence);

		return await this.userRepository.updateById(entity.id, updateData);
	}
}