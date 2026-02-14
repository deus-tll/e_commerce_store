import crypto from "crypto";

import {IUserTokenService} from "../../interfaces/user/IUserTokenService.js";
import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {PasswordService} from "../security/PasswordService.js";

import {BadRequestError, ConflictError} from "../../errors/apiErrors.js";

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
		return crypto.randomBytes(20).toString("hex");
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
			throw new BadRequestError("Invalid or expired verification token");
		}

		const updateData = Object.freeze({
			isVerified: true,
			verificationToken: null,
			verificationTokenExpiresAt: null
		});

		const updatedEntity = await this.#userRepository.updateById(entity.id, updateData);

		if (!updatedEntity) {
			throw new ConflictError("Could not update user verification status.");
		}

		return updatedEntity;
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
			throw new BadRequestError("Invalid or expired reset token");
		}

		const hashedPassword = await this.#passwordService.hashPassword(newPassword);

		const updateData = Object.freeze({
			password: hashedPassword,
			resetPasswordToken: null,
			resetPasswordTokenExpiresAt: null
		});

		const updatedEntity = await this.#userRepository.updateById(entity.id, updateData);

		if (!updatedEntity) {
			throw new ConflictError("Could not update user password.");
		}

		return updatedEntity;
	}
}