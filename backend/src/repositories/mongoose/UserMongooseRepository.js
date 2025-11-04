import User from "../../models/mongoose/User.js";

import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {RepositoryPaginationResult} from "../../domain/index.js";

import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {BadRequestError, ConflictError} from "../../errors/apiErrors.js";

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

	async updateById(id, data, options = {}) {
		const agnosticUpdate = data.toUpdateObject();
		const mongooseUpdate = { $set: {} };

		Object.assign(mongooseUpdate.$set, agnosticUpdate);

		if (Object.keys(mongooseUpdate.$set).length === 0) {
			throw new BadRequestError("Nothing to update");
		}

		const updateOptions = { new: true, runValidators: true, ...options };

		const updatedDoc = await User.findByIdAndUpdate(id, mongooseUpdate, updateOptions).lean();

		return MongooseAdapter.toUserEntity(updatedDoc);
	}

	async deleteById(id) {
		const deletedDoc = await User.findByIdAndDelete(id).lean();
		return MongooseAdapter.toUserEntity(deletedDoc);
	}

	async findById(id, options = {}) {
		const { withPassword = false } = options;
		let query = User.findById(id).lean();

		if (withPassword) {
			query = query.select('+password');
		}

		const foundDoc = await query;

		return MongooseAdapter.toUserEntity(foundDoc);
	}

	async findOne(query, options = {}) {
		const { withPassword = false } = options;
		let dbQuery = User.findOne(query).lean();

		if (withPassword) {
			dbQuery = dbQuery.select("+password");
		}

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
}