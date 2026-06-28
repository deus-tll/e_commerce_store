import {UserEntity} from "../../entities/user/UserEntity.js";
import {RepositoryPaginationResult} from "../types/shared.js";
import {
	UserCreatePersistence, UserUpdatePersistence,
	UserFindOneOptionsInput, UserFindOneQueryInput,
	UserFiltersPersistence, UserStatsDTO, UserCountFilters
} from "../types/user.js";

export abstract class IUserRepository {
	abstract create(data: UserCreatePersistence): Promise<UserEntity>;
	abstract updateById(id: string, data: UserUpdatePersistence): Promise<UserEntity>;
	abstract deleteById(id: string): Promise<UserEntity>;
	abstract findById(
		id: string,
		options: UserFindOneOptionsInput
	): Promise<UserEntity | null>;

	abstract findOne(
		query: UserFindOneQueryInput,
		options?: UserFindOneOptionsInput
	): Promise<UserEntity | null>;

	abstract findAndCount(
		filters: UserFiltersPersistence,
		skip: number,
		limit: number
	): Promise<RepositoryPaginationResult<UserEntity>>;

	abstract count(filters: UserCountFilters): Promise<number>;
	abstract findByIds(ids: string[]): Promise<UserEntity[]>;
	abstract findByValidVerificationToken(token: string): Promise<UserEntity|null>;
	abstract findByValidResetToken(token: string): Promise<UserEntity|null>;
	abstract exists(id: string): Promise<boolean>;
	abstract getGlobalStats(): Promise<UserStatsDTO>;
}