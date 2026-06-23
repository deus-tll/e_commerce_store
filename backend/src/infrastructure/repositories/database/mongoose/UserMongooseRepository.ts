import {MongoServerError} from "mongodb";
import {FilterQuery} from "mongoose";
import User, {IUserDoc} from "./models/User.js";

import {IUserRepository} from "../../../../application/user/IUserRepository.js";
import {UserAdapter} from "./adapters/UserAdapter.js";

import {UserEntity} from "../../../../entities/user/UserEntity.js";
import {
	UserCreatePersistence,
	UserFindOneOptionsInput,
	UserFindOneQueryInput,
	UserFiltersPersistence,
	UserStatsDTO,
	UserUpdatePersistence, UserCountFilters
} from "../../../../application/types/user.js";
import {RepositoryPaginationResult} from "../../../../application/types/shared.js";

import {EntityAlreadyExistsError, EntityNotFoundError} from "../../../../errors/index.js";

import {UserRole} from "../../../../enums/application.js";

import {sanitizeSearchTerm} from "../../../../utils/sanitize.js";
import {determineSort} from "./utils.js";

export class UserMongooseRepository extends IUserRepository {
	private toEntityOrThrow(doc?: IUserDoc | null, criteria: any = {}): UserEntity {
		const entity = UserAdapter.toEntity(doc);

		if (!entity) throw new EntityNotFoundError("User", criteria);

		return entity;
	}

	private buildQuery(filters: UserFiltersPersistence): FilterQuery<IUserDoc> {
		const { search, role, isVerified } = filters;
		const query: FilterQuery<IUserDoc> = {
			...(role && { role }),
			...(isVerified !== undefined && { isVerified })
		};

		if (search) {
			const sanitizedTerm = sanitizeSearchTerm(search);

			if (!sanitizedTerm) return query;

			const searchRegex = new RegExp(sanitizedTerm, 'i');

			query.$or = [
				{ name: { $regex: searchRegex } },
				{ email: { $regex: searchRegex } }
			];
		}

		return query;
	}

	async create(data: UserCreatePersistence): Promise<UserEntity> {
		try {
			const createdDoc = await User.create(data);
			return UserAdapter.toEntityRequired(createdDoc);
		}
		catch (error) {
			if (error instanceof MongoServerError && error.code === 11000) {
				const keyPattern = error["keyPattern"];
				const key = Object.keys(keyPattern)[0] as keyof UserCreatePersistence;
				throw new EntityAlreadyExistsError("User", { [key]: data[key] });
			}
			throw error;
		}
	}

	async updateById(id: string, data: UserUpdatePersistence): Promise<UserEntity> {
		const updatedDoc = await User.findByIdAndUpdate(
			id,
			{ $set: data },
			{ new: true, runValidators: true }
		).lean();

		return this.toEntityOrThrow(updatedDoc, { id });
	}

	async deleteById(id: string): Promise<UserEntity> {
		const deletedDoc = await User.findByIdAndDelete(id).lean();
		return this.toEntityOrThrow(deletedDoc, { id });
	}

	async findById(id: string, options: UserFindOneOptionsInput = {}): Promise<UserEntity | null> {
		const { withPassword = false } = options;

		let query = User.findById(id).lean();

		if (withPassword) query = query.select('+password');

		const foundDoc = await query;
		return UserAdapter.toEntity(foundDoc);
	}

	async findOne(query: UserFindOneQueryInput, options?: UserFindOneOptionsInput): Promise<UserEntity | null> {
		const { withPassword = false } = options ?? {};

		let dbQuery = User.findOne(query).lean();

		if (withPassword) dbQuery = dbQuery.select("+password");

		const foundDoc = await dbQuery;
		return UserAdapter.toEntity(foundDoc);
	}

	async findAndCount(
		filters: UserFiltersPersistence,
		skip: number,
		limit: number
	): Promise<RepositoryPaginationResult<UserEntity>> {
		const { sortBy = "createdAt", order = "desc", ...restFilters } = filters;

		const query = this.buildQuery(restFilters);

		const sortObject = determineSort(sortBy, order);

		const [foundDocs, total] = await Promise.all([
			User.find(query).skip(skip).limit(limit).sort(sortObject).lean(),
			User.countDocuments(query)
		]);

		const users = foundDocs.map(doc => UserAdapter.toEntityRequired(doc));

		return new RepositoryPaginationResult(users, total);
	}

	async count(filters: UserCountFilters): Promise<number> {
		const mongooseQuery = this.buildQuery(filters);
		return User.countDocuments(mongooseQuery);
	}

	async findByIds(ids: string[]): Promise<UserEntity[]> {
		const foundDocs = await User.find({ _id: { $in: ids } }).lean();
		return foundDocs.map(doc => UserAdapter.toEntityRequired(doc));
	}

	async findByValidVerificationToken(token: string): Promise<UserEntity | null> {
		const foundDoc = await User.findOne({
			verificationToken: token,
			verificationTokenExpiresAt: { $gt: new Date() },
		}).lean();

		return UserAdapter.toEntity(foundDoc);
	}

	async findByValidResetToken(token: string): Promise<UserEntity | null> {
		const foundDoc = await User.findOne({
			resetPasswordToken: token,
			resetPasswordTokenExpiresAt: { $gt: new Date() },
		}).lean();

		return UserAdapter.toEntity(foundDoc);
	}

	async exists(id: string): Promise<boolean> {
		return Boolean(await User.exists({ _id: id }));
	}

	async getGlobalStats(): Promise<UserStatsDTO> {
		const [stats] = await User.aggregate([
			{
				$group: {
					_id: null,
					total: { $sum: 1 },
					verified: {
						$sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] }
					},
					admins: {
						$sum: { $cond: [{ $eq: ["$role", UserRole.ADMIN] }, 1, 0]  }
					},
					customers: {
						$sum: { $cond: [{ $eq: ["$role", UserRole.CUSTOMER] }, 1, 0]  }
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

		return new UserStatsDTO(
			stats || {
				total: 0,
				verified: 0,
				unverified: 0,
				admins: 0,
				customers: 0
			}
		);
	}
}