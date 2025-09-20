import User from "../models/User.js";
import {BadRequestError, ConflictError, NotFoundError} from "../errors/apiErrors.js";

export class UserService {
	toDTO(user) {
		return {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			isVerified: user.isVerified,
			lastLogin: user.lastLogin,
			createdAt: user.createdAt
		};
	}

	async createUser({ name, email, password, role = "customer", isVerified = false }) {
		try {
			return await User.create({
				name,
				email,
				password,
				role,
				isVerified
			});
		}
		catch (error) {
			// MongoDB duplicate key error (11000)
			if (error.code === 11000 && error.keyPattern?.email) {
				throw new ConflictError("User with this email already exists");
			}

			throw error;
		}
	}

	async updateUser(userId, data) {
		const restrictedFields = [
			'password', 'verificationToken', 'verificationTokenExpiresAt',
			'resetPasswordToken', 'resetPasswordTokenExpiresAt'
		];

		const hasRestrictedField = restrictedFields.some(field => field in data);
		if (hasRestrictedField) {
			throw new BadRequestError("Cannot update restricted fields directly");
		}

		const user = await User.findByIdAndUpdate(userId, data, {
			new: true,
			runValidators: true
		});

		if (!user) {
			throw new NotFoundError("User not found");
		}

		return user;
	}

	async updateLastLogin(userId) {
		return await this.updateUser(userId, { lastLogin: new Date() });
	}

	async setVerificationToken(userId, token, expiresAt) {
		return User.findByIdAndUpdate(userId, {
			verificationToken: token,
			verificationTokenExpiresAt: expiresAt
		}, { new: true });
	}

	async verifyUser(verificationToken) {
		const user = await User.findOne({
			verificationToken,
			verificationTokenExpiresAt: { $gt: Date.now() }
		});

		if (!user) {
			throw new BadRequestError("Invalid or expired verification token");
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;

		await user.save();

		return user;
	}

	async setResetPasswordToken(userId, token, expiresAt) {
		return User.findByIdAndUpdate(userId, {
			resetPasswordToken: token,
			resetPasswordTokenExpiresAt: expiresAt
		}, { new: true });
	}

	async resetUserPassword(resetToken, newPassword) {
		const user = await User.findOne({
			resetPasswordToken: resetToken,
			resetPasswordTokenExpiresAt: { $gt: Date.now() }
		});

		if (!user) {
			throw new BadRequestError("Invalid or expired reset token");
		}

		user.password = newPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpiresAt = undefined;

		await user.save();

		return user;
	}

	async changePassword(user, newPassword) {
		if (!user) {
			throw new NotFoundError("User not found");
		}

		user.password = newPassword;

		await user.save();

		return user;
	}

	async deleteUser(userId) {
		const user = await User.findByIdAndDelete(userId);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		return user;
	}

	async getAllUsers(page = 1, limit = 10, filters = {}) {
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

		const [users, total] = await Promise.all([
			User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
			User.countDocuments(query)
		]);

		return {
			users: users,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit)
			}
		};
	}

	async getUserById(userId, options = {}) {
		const { withPassword = false, throwIfNotFound = true } = options;

		let query = User.findById(userId);

		if (withPassword) {
			query = query.select('+password');
		}

		const user = await query;

		if (!user && throwIfNotFound) {
			throw new NotFoundError("User not found");
		}

		return user;
	}

	async getUserByEmail(email, options = {}) {
		const { withPassword = false, throwIfNotFound = false } = options;

		let query = User.findOne({ email });

		if (withPassword) {
			query = query.select("+password");
		}

		const user = await query;

		if (!user && throwIfNotFound) {
			throw new NotFoundError("User not found");
		}

		return user;
	}

	async checkUserExistsByEmail(email) {
		const user = await this.getUserByEmail(email);
		return !!user;
	}

	async findOrCreateAdmin(adminData) {
		const exists = await this.checkUserExistsByEmail(adminData.email);

		if (exists) return null;

		return await this.createUser({
			...adminData,
			role: "admin",
			isVerified: true
		});
	}
}