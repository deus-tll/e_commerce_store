import {IUserRepository} from "../../interfaces/user/IUserRepository.js";
import User from "../../models/mongoose/User.js";
import {ConflictError} from "../../errors/apiErrors.js";

export class UserMongooseRepository extends IUserRepository {
	async create(data) {
		try {
			const user = new User(data);
			return await user.save();
		} catch (error) {
			if (error.code === 11000 && error.keyPattern?.email) {
				throw new ConflictError("A user with this email already exists.");
			}
			throw error;
		}
	}

	async updateById(id, data, options = {}) {
		const updateOptions = { new: true, runValidators: true, ...options };

		return await User.findByIdAndUpdate(id, data, updateOptions);
	}

	async deleteById(id) {
		return User.findByIdAndDelete(id);
	}

	async findById(id, options = {}) {
		const { withPassword = false } = options;
		let query = User.findById(id);

		if (withPassword) {
			query = query.select('+password');
		}

		return query;
	}

	async findOne(query, options = {}) {
		const { withPassword = false } = options;
		let dbQuery = User.findOne(query);

		if (withPassword) {
			dbQuery = dbQuery.select("+password");
		}

		return dbQuery;
	}

	async findAndCount(query, skip, limit, sort = { createdAt: -1 }) {
		const [users, total] = await Promise.all([
			User.find(query).skip(skip).limit(limit).sort(sort),
			User.countDocuments(query)
		]);

		return { users, total };
	}

	async comparePassword(entity, password) {
		return entity.comparePassword(password);
	}
}