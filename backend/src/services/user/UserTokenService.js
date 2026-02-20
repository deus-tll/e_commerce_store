import crypto from "crypto";

import {IUserTokenService} from "../../interfaces/user/IUserTokenService.js";
import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {PasswordService} from "../security/PasswordService.js";

import {DomainValidationError} from "../../errors/index.js";

/**
 * Service dedicated to managing user account tokens (verification, password reset)
 * and related security/lifecycle updates.
 * @augments IUserTokenService
 */
export class UserTokenService extends IUserTokenService {
	/** @type {IUserRepository} */ #userRepository;
	/** @type {PasswordService} */ #passwordService;

	/**
	 * @param {IUserRepository} userRepository
	 * @param {PasswordService} passwordService
	 */
	constructor(userRepository, passwordService) {
		super();
		this.#userRepository = userRepository;
		this.#passwordService = passwordService;
	}

	generateVerificationToken() {
		return crypto.randomInt(100000, 1000000).toString();
	}

	generateResetToken() {
		return crypto.randomUUID();
	}

	async setVerificationToken(userId, token, expiresAt) {
		const updateData = Object.freeze({
			verificationToken: token,
			verificationTokenExpiresAt: expiresAt
		});

		return this.#userRepository.updateById(userId, updateData);
	}

	async verifyUser(token) {
		const entity = await this.#userRepository.findByValidVerificationToken(token);

		if (!entity) {
			throw new DomainValidationError("Invalid or expired verification token");
		}

		const updateData = Object.freeze({
			isVerified: true,
			verificationToken: null,
			verificationTokenExpiresAt: null
		});

		return await this.#userRepository.updateById(entity.id, updateData);
	}

	async setResetPasswordToken(userId, token, expiresAt) {
		const updateData = Object.freeze({
			resetPasswordToken: token,
			resetPasswordTokenExpiresAt: expiresAt
		});

		return this.#userRepository.updateById(userId, updateData);
	}

	async resetPassword(token, newPassword) {
		const entity = await this.#userRepository.findByValidResetToken(token);

		if (!entity) {
			throw new DomainValidationError("Invalid or expired reset token");
		}

		const hashedPassword = await this.#passwordService.hashPassword(newPassword);

		const updateData = Object.freeze({
			password: hashedPassword,
			resetPasswordToken: null,
			resetPasswordTokenExpiresAt: null
		});

		return await this.#userRepository.updateById(entity.id, updateData);
	}
}