import {IUserRepository} from "./IUserRepository.js";
import {PasswordService} from "../../infrastructure/security/PasswordService.js";
import {UserMapper} from "./UserMapper.js";

import {UserEntity} from "../../entities/user/UserEntity.js";
import {
	ShortUserDTO,
	UserCreateInput, UserCreatePersistence,
	UserDTO,
	UserFiltersInput,
	UserFindOneOptionsInput,
	UserPaginationResultDTO,
	UserUpdateInput, UserUpdatePersistence
} from "../types/user.js";
import {PaginationMetadata} from "../types/shared.js";

import {EntityNotFoundError, SystemError} from "../../errors/index.js";

import {UserRole} from "../../enums/application.js";

export class UserService {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly passwordProvider: PasswordService
	) {}

	async create(data: UserCreateInput): Promise<UserDTO> {
		const { password, ...rest } = data;

		const persistenceData: UserCreatePersistence = Object.freeze({
			...rest,
			password: await this.passwordProvider.hashPassword(password)
		} satisfies UserCreatePersistence);

		const createdEntity = await this.userRepository.create(persistenceData);
		return UserMapper.toDTO(createdEntity);
	}

	async update(id: string, data: UserUpdateInput, requester: UserDTO): Promise<UserDTO> {
		const { role, isVerified, ...rest } = data;

		const criticalFieldsUpdate = requester.role === UserRole.ADMIN && {
			...(role !== undefined && { role }),
			...(isVerified !== undefined && { isVerified }),
		}

		const persistenceData: UserUpdatePersistence = Object.freeze({
			...rest,
			...criticalFieldsUpdate
		});

		const updatedEntity = await this.userRepository.updateById(id, persistenceData);
		return UserMapper.toDTO(updatedEntity);
	}

	async updateLastLogin(id: string): Promise<UserDTO> {
		const updatedEntity = await this.userRepository.updateById(id, { lastLogin: new Date() });
		return UserMapper.toDTO(updatedEntity);
	}

	async changePassword(entity: UserEntity, newPassword: string): Promise<UserDTO> {
		if (!entity.hashedPassword) {
			throw new SystemError("Password hash was not loaded for comparison.");
		}

		const hashedPassword = await this.passwordProvider.hashPassword(newPassword);
		const updatedEntity = await this.userRepository.updateById(entity.id, { password: hashedPassword });

		return UserMapper.toDTO(updatedEntity);
	}

	async delete(id: string): Promise<UserDTO> {
		const deletedEntity = await this.userRepository.deleteById(id);
		return UserMapper.toDTO(deletedEntity);
	}

	async getAll(page: number = 1, limit: number = 10, filters: UserFiltersInput = {}): Promise<UserPaginationResultDTO> {
		const skip = (page - 1) * limit;

		const { results, total } = await this.userRepository.findAndCount(filters, skip, limit);

		const pages = Math.ceil(total / limit);
		const userDTOs = UserMapper.toDTOs(results);

		return new UserPaginationResultDTO(
			userDTOs,
			new PaginationMetadata(page, limit, total, pages)
		);
	}

	async getEntityById(id: string, options: UserFindOneOptionsInput = {}): Promise<UserEntity | null> {
		return await this.userRepository.findById(id, options);
	}

	async getEntityByIdOrFail(id: string, options: UserFindOneOptionsInput = {}): Promise<UserEntity> {
		const entity = await this.getEntityById(id, options);
		if (!entity) throw new EntityNotFoundError("User", { id });
		return entity;
	}

	async getEntityByEmailOrFail(email: string, options: UserFindOneOptionsInput = {}): Promise<UserEntity> {
		const entity = await this.userRepository.findOne({email}, options);
		if (!entity) throw new EntityNotFoundError("User", { email });
		return entity;
	}

	async getShortDTOById(id: string): Promise<ShortUserDTO | null> {
		const entity = await this.getEntityById(id);

		if (!entity) {
			return null;
		}

		return UserMapper.toShortDTO(entity);
	}

	async getShortDTOByIdOrFail(id: string): Promise<ShortUserDTO> {
		const entity = await this.getEntityByIdOrFail(id);
		return UserMapper.toShortDTO(entity);
	}

	async getByIdOrFail(id: string, options: UserFindOneOptionsInput = {}): Promise<UserDTO> {
		const entity = await this.getEntityByIdOrFail(id, options);
		return UserMapper.toDTO(entity);
	}

	async getShortDTOsByIds(ids: string[]): Promise<ShortUserDTO[]> {
		const entities = await this.userRepository.findByIds(ids);
		return UserMapper.toShortDTOs(entities);
	}

	async existsByEmail(email: string): Promise<boolean> {
		const entity = await this.userRepository.findOne({ email });
		return !!entity;
	}
}