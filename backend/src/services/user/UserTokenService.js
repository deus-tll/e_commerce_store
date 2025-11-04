import crypto from "crypto";

import {IUserTokenService} from "../../interfaces/user/IUserTokenService.js";
import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {PasswordService} from "../security/PasswordService.js";
import {UpdateUserDTO} from "../../domain/index.js";

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
		const updateUserDTO = new UpdateUserDTO({
			verificationToken: token,
			verificationTokenExpiresAt: expiresAt
		});

		return this.#userRepository.updateById(userId, updateUserDTO);
	}

	async verifyUser(token) {
		const entity = await this.#userRepository.findByValidVerificationToken(token);

		if (!entity) {
			throw new BadRequestError("Invalid or expired verification token");
		}

		const updateUserDTO = new UpdateUserDTO({
			isVerified: true,
			verificationToken: undefined,
			verificationTokenExpiresAt: undefined,
		});

		const updatedEntity = await this.#userRepository.updateById(entity.id, updateUserDTO);

		if (!updatedEntity) {
			throw new ConflictError("Could not update user verification status.");
		}

		return updatedEntity;
	}

	async setResetPasswordToken(userId, token, expiresAt) {
		const updateUserDTO = new UpdateUserDTO({
			resetPasswordToken: token,
			resetPasswordTokenExpiresAt: expiresAt
		});

		return this.#userRepository.updateById(userId, updateUserDTO);
	}

	async resetPassword(token, newPassword) {
		const entity = await this.#userRepository.findByValidResetToken(token);

		if (!entity) {
			throw new BadRequestError("Invalid or expired reset token");
		}

		const hashedPassword = await this.#passwordService.hashPassword(newPassword);

		const updateUserDTO = new UpdateUserDTO({
			password: hashedPassword,
			resetPasswordToken: undefined,
			resetPasswordTokenExpiresAt: undefined,
		});

		const updatedEntity = await this.#userRepository.updateById(entity.id, updateUserDTO);

		if (!updatedEntity) {
			throw new ConflictError("Could not update user password.");
		}

		return updatedEntity;
	}
}