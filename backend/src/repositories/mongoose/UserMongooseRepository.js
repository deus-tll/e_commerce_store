import User from "../../models/mongoose/User.js";

import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {RepositoryPaginationResult} from "../../domain/index.js";

import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {ConflictError} from "../../errors/apiErrors.js";
import {UserRoles} from "../../constants/app.js";

export class UserMongooseRepository extends IUserRepository {
	#buildMongooseQuery(query) {
		const mongooseQuery = {};

		if (query.search) {
			const searchRegex = new RegExp(query.search, 'i');

			// Construct the Mongoose-specific OR condition for name and email
			mongooseQuery.$or = [
				{ name: { $regex: searchRegex } },
				{ email: { $regex: searchRegex } }
			];
		}

		for (const key in query) {
			if (key !== 'search') {
				mongooseQuery[key] = query[key];
			}
		}

		return mongooseQuery;
	}

	async create(data) {
		try {
			const createdDoc = await User.create(data);
			return MongooseAdapter.toUserEntity(createdDoc);
		}
		catch (error) {
			const keyPattern = error['keyPattern'];

			if (error.code === 11000 && keyPattern.email) {
				throw new ConflictError("A user with this email already exists.");
			}
			throw error;
		}
	}

	async updateById(id, data) {
		const updatedDoc = await User.findByIdAndUpdate(
			id,
			{ $set: data },
			{ new: true, runValidators: true }
		).lean();

		return MongooseAdapter.toUserEntity(updatedDoc);
	}

	async deleteById(id) {
		const deletedDoc = await User.findByIdAndDelete(id).lean();
		return MongooseAdapter.toUserEntity(deletedDoc);
	}

	async findById(id, { withPassword = false } = {}) {
		let query = User.findById(id).lean();

		if (withPassword) query = query.select('+password');

		const foundDoc = await query;
		return MongooseAdapter.toUserEntity(foundDoc);
	}

	async findOne(query, { withPassword = false } = {}) {
		let dbQuery = User.findOne(query).lean();

		if (withPassword) dbQuery = dbQuery.select("+password");

		const foundDoc = await dbQuery;
		return MongooseAdapter.toUserEntity(foundDoc);
	}

	async findAndCount(query, skip, limit, sort = { createdAt: -1 }) {
		const mongooseQuery = this.#buildMongooseQuery(query);

		const [foundDocs, total] = await Promise.all([
			User.find(mongooseQuery).skip(skip).limit(limit).sort(sort).lean(),
			User.countDocuments(mongooseQuery)
		]);

		const users = foundDocs.map(doc => MongooseAdapter.toUserEntity(doc));

		return new RepositoryPaginationResult(users, total);
	}

	async count(query) {
		const mongooseQuery = this.#buildMongooseQuery(query);
		return await User.countDocuments(mongooseQuery);
	}

	async findByIds(ids) {
		const foundDocs = await User.find({ _id: { $in: ids } }).lean();
		return foundDocs.map(doc => MongooseAdapter.toUserEntity(doc));
	}

	async findByValidVerificationToken(token) {
		const foundDoc = await User.findOne({
			verificationToken: token,
			verificationTokenExpiresAt: { $gt: new Date() },
		}).lean();

		return MongooseAdapter.toUserEntity(foundDoc);
	}

	async findByValidResetToken(token) {
		const foundDoc = await User.findOne({
			resetPasswordToken: token,
			resetPasswordTokenExpiresAt: { $gt: new Date() },
		}).lean();

		return MongooseAdapter.toUserEntity(foundDoc);
	}

	async getGlobalStats() {
		const [stats] = await User.aggregate([
			{
				$group: {
					_id: null,
					total: { $sum: 1 },
					verified: {
						$sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] }
					},
					admins: {
						$sum: { $cond: [{ $eq: ["$role", UserRoles.ADMIN] }, 1, 0]  }
					},
					customers: {
						$sum: { $cond: [{ $eq: ["$role", UserRoles.CUSTOMER] }, 1, 0]  }
					}
				}
			},
			{
				$project: {
					_id: 0,
					total: 1,
					verified: 1,
					unverified: { $subtract: ["$total", "$verified"] },
					admins: 1,
					customers: 1
				}
			}
		]);

		return stats || { total: 0, verified: 0, unverified: 0, admins: 0, customers: 0 };
	}
}