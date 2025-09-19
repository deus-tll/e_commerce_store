import User from "../models/User.js";
import {BadRequestError, NotFoundError} from "../errors/apiErrors.js";

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
		const exists = await User.findOne({ email });

		if (exists) {
			throw new BadRequestError("User already exists");
		}

		return await User.create({
			name,
			email,
			password,
			role,
			isVerified
		});
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