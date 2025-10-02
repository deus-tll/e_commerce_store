import {IUserService} from "../interfaces/user/IUserService.js";
import {BadRequestError, NotFoundError} from "../errors/apiErrors.js";

export class UserService extends IUserService {
	/**
	 * @type {IUserRepository}
	 */
	userRepository;

	/**
	 * @param {IUserRepository} userRepository - The repository implementation.
	 */
	constructor(userRepository) {
		super();
		this.userRepository = userRepository;
	}

	toDTO(entity) {
		return {
			_id: entity._id,
			name: entity.name,
			email: entity.email,
			role: entity.role,
			isVerified: entity.isVerified,
			lastLogin: entity.lastLogin,
			createdAt: entity.createdAt
		};
	}

	async create(data) {
		return await this.userRepository.create(data);
	}

	async update(id, data) {
		const restrictedFields = [
			'password', 'verificationToken', 'verificationTokenExpiresAt',
			'resetPasswordToken', 'resetPasswordTokenExpiresAt'
		];

		const hasRestrictedField = restrictedFields.some(field => field in data);
		if (hasRestrictedField) {
			throw new BadRequestError("Cannot update restricted fields directly");
		}

		const user = await this.userRepository.updateById(id, data, {
			new: true,
			runValidators: true
		});

		if (!user) {
			throw new NotFoundError("User not found");
		}

		return user;
	}

	async updateLastLogin(id) {
		return await this.update(id, { lastLogin: new Date() });
	}

	async setVerificationToken(id, token, expiresAt) {
		return this.userRepository.updateById(id, {
			verificationToken: token,
			verificationTokenExpiresAt: expiresAt
		}, { new: true });
	}

	async verify(token) {
		const user = await this.userRepository.findOne({
			verificationToken: token,
			verificationTokenExpiresAt: { $gt: Date.now() }
		});

		if (!user) {
			throw new BadRequestError("Invalid or expired verification token");
		}

		const updatedUser = await this.userRepository.updateById(user._id, {
			isVerified: true,
			verificationToken: undefined,
			verificationTokenExpiresAt: undefined,
		}, { new: true });

		if (!updatedUser) {
			throw new NotFoundError("User not found during verification update");
		}

		return updatedUser;
	}

	async setResetPasswordToken(id, token, expiresAt) {
		return this.userRepository.updateById(id, {
			resetPasswordToken: token,
			resetPasswordTokenExpiresAt: expiresAt
		}, { new: true });
	}

	async resetPassword(token, newPassword) {
		const user = await this.userRepository.findOne({
			resetPasswordToken: token,
			resetPasswordTokenExpiresAt: { $gt: Date.now() }
		});

		if (!user) {
			throw new BadRequestError("Invalid or expired reset token");
		}

		const updatedUser = await this.userRepository.updateById(user._id, {
			password: newPassword,
			resetPasswordToken: undefined,
			resetPasswordTokenExpiresAt: undefined,
		}, { new: true });

		if (!updatedUser) {
			throw new NotFoundError("User not found during password reset");
		}

		return updatedUser;
	}

	async changePassword(entity, newPassword) {
		if (!entity) {
			throw new NotFoundError("User not found");
		}

		const updatedUser = await this.userRepository.updateById(entity._id, {
			password: newPassword,
		}, { new: true });

		if (!updatedUser) {
			throw new NotFoundError("User not found during password change");
		}

		return updatedUser;
	}

	async delete(id) {
		const user = await this.userRepository.deleteById(id);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		return user;
	}

	async getAll(page = 1, limit = 10, filters = {}) {
		const skip = (page - 1) * limit;

		const query = {};
		if (filters.role) query.role = filters.role;
		if (filters.isVerified !== undefined) query.isVerified = filters.isVerified;
		if (filters.search) {
			query.$or = [
				{ name: { $regex: filters.search, $options: 'i' } },
				{ email: { $regex: filters.search, $options: 'i' } }
			];
		}

		const { users, total } = await this.userRepository.findAndCount(query, skip, limit);

		return {
			users: users.map(this.toDTO),
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit)
			}
		};
	}

	async getById(id, options = {}) {
		const { throwIfNotFound = true } = options;

		const user = await this.userRepository.findById(id, options);

		if (!user && throwIfNotFound) {
			throw new NotFoundError("User not found");
		}

		return user;
	}

	async getByEmail(email, options = {}) {
		const { throwIfNotFound = false } = options;

		const user = await this.userRepository.findOne({ email }, options);

		if (!user && throwIfNotFound) {
			throw new NotFoundError("User not found");
		}

		return user;
	}

	async existsByEmail(email) {
		const user = await this.getByEmail(email);
		return !!user;
	}

	async comparePassword(entity, password) {
		return this.userRepository.comparePassword(entity, password);
	}

	async findOrCreateAdmin(data) {
		const exists = await this.existsByEmail(data.email);

		if (exists) return null;

		return await this.create({
			...data,
			role: "admin",
			isVerified: true
		});
	}
}