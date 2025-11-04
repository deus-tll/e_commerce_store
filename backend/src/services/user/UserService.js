import {IUserService} from "../../interfaces/user/IUserService.js";
import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {IUserTokenService} from "../../interfaces/user/IUserTokenService.js";
import {IUserMapper} from "../../interfaces/mappers/IUserMapper.js";
import {IUserQueryBuilder} from "../../interfaces/user/IUserQueryBuilder.js";
import {IUserStatsService} from "../../interfaces/user/IUserStatsService.js";
import {CreateUserDTO, UserPaginationResultDTO, UpdateUserDTO, PaginationMetadata} from "../../domain/index.js";
import {PasswordService} from "../security/PasswordService.js";

import {BadRequestError, ConflictError, InternalServerError, NotFoundError} from "../../errors/apiErrors.js";

/**
 * @augments IUserService
 * @description Agnostic business logic layer for user operations.
 */
export class UserService extends IUserService {
	/** @type {IUserRepository} */ #userRepository;
	/** @type {PasswordService} */ #passwordService;
	/** @type {IUserTokenService} */ #userTokenService;
	/** @type {IUserMapper} */ #userMapper;
	/** @type {IUserQueryBuilder} */ #userQueryBuilder;
	/** @type {IUserStatsService} */ #userStatsService;

	/**
	 * @param {IUserRepository} userRepository
	 * @param {PasswordService} passwordService
	 * @param {IUserTokenService} userTokenService
	 * @param {IUserMapper} userMapper
	 * @param {IUserQueryBuilder} userQueryBuilder
	 * @param {IUserStatsService} userStatsService
	 */
	constructor(userRepository, passwordService, userTokenService, userMapper, userQueryBuilder, userStatsService) {
		super();
		this.#userRepository = userRepository;
		this.#passwordService = passwordService;
		this.#userTokenService = userTokenService;
		this.#userMapper = userMapper;
		this.#userQueryBuilder = userQueryBuilder;
		this.#userStatsService = userStatsService;
	}

	#checkRestrictedUpdateFields(data) {
		const restrictedFields = [
			'password', 'verificationToken', 'verificationTokenExpiresAt',
			'resetPasswordToken', 'resetPasswordTokenExpiresAt'
		];

		const hasRestrictedField = restrictedFields.some(field => field in data);
		if (hasRestrictedField) {
			throw new BadRequestError("Cannot update restricted fields directly");
		}
	}

	/**
	 * Internal helper to check if an entity was found, throwing a NotFoundError if not.
	 * @param {*} entity - The found entity (or null).
	 * @returns {*} - The entity if found.
	 * @private
	 */
	#checkEntityOrFail(entity) {
		if (!entity) {
			throw new NotFoundError("User not found");
		}
		return entity;
	}

	async create(data) {
		const hashedPassword = await this.#passwordService.hashPassword(data.password);

		const repositoryData = new CreateUserDTO({
			...data,
			password: hashedPassword
		});

		const createdEntity = await this.#userRepository.create(repositoryData);

		return this.#userMapper.toDTO(createdEntity);
	}

	async update(id, data) {
		this.#checkRestrictedUpdateFields(data);

		const updatedEntity = await this.#userRepository.updateById(id, data);

		this.#checkEntityOrFail(updatedEntity);

		return this.#userMapper.toDTO(updatedEntity);
	}

	async updateLastLogin(id) {
		const updateData = new UpdateUserDTO({ lastLogin: new Date() });
		const updatedEntity = await this.#userRepository.updateById(id, updateData);

		if (!updatedEntity) return null;

		return this.#userMapper.toDTO(updatedEntity);
	}

	async setVerificationToken(id, token, expiresAt) {
		const updatedEntity = await this.#userTokenService.setVerificationToken(id, token, expiresAt);

		if (!updatedEntity) return null;

		return this.#userMapper.toDTO(updatedEntity);
	}

	async verify(token) {
		const updatedEntity = await this.#userTokenService.verifyUser(token);

		return this.#userMapper.toDTO(updatedEntity);
	}

	async setResetPasswordToken(id, token, expiresAt) {
		const updatedEntity = await this.#userTokenService.setResetPasswordToken(id, token, expiresAt);

		if (!updatedEntity) return null;

		return this.#userMapper.toDTO(updatedEntity);
	}

	async resetPassword(token, newPassword) {
		const updatedEntity = await this.#userTokenService.resetPassword(token, newPassword);

		return this.#userMapper.toDTO(updatedEntity);
	}

	async changePassword(entity, newPassword) {
		if (!entity.password) {
			throw new InternalServerError("Internal error: Password hash was not loaded for comparison.");
		}

		const hashedPassword = await this.#passwordService.hashPassword(newPassword);

		const updateUserDTO = new UpdateUserDTO({ password: hashedPassword });

		const updatedEntity = await this.#userRepository.updateById(entity.id, updateUserDTO);

		if (!updatedEntity) {
			throw new ConflictError("Could not update user password.");
		}

		return this.#userMapper.toDTO(updatedEntity);
	}

	async delete(id) {
		const deletedEntity = await this.#userRepository.deleteById(id);

		this.#checkEntityOrFail(deletedEntity);

		return this.#userMapper.toDTO(deletedEntity);
	}

	async getAll(page = 1, limit = 10, filters = {}) {
		const skip = (page - 1) * limit;
		const query = this.#userQueryBuilder.buildQuery(filters);

		const repositoryPaginationResult = await this.#userRepository.findAndCount(query, skip, limit);

		const total = repositoryPaginationResult.total;
		const pages = Math.ceil(total / limit);

		const userDTOs = this.#userMapper.toDTOs(repositoryPaginationResult.results);
		const paginationMetadata = new PaginationMetadata(page, limit, total, pages);

		return new UserPaginationResultDTO(userDTOs, paginationMetadata);
	}

	async getEntityById(id, options = {}) {
		return await this.#userRepository.findById(id, options);
	}

	async getEntityByIdOrFail(id, options = {}) {
		const entity = await this.getEntityById(id, options);
		return this.#checkEntityOrFail(entity);
	}

	async getEntityByEmail(email, options = {}) {
		return await this.#userRepository.findOne({email}, options);
	}

	async getEntityByEmailOrFail(email, options = {}) {
		const entity = await this.getEntityByEmail(email, options);
		return this.#checkEntityOrFail(entity);
	}

	async getById(id, options = {}) {
		const entity = await this.getEntityById(id, options);

		if (!entity) {
			return null;
		}

		return this.#userMapper.toDTO(entity);
	}

	async getByIdOrFail(id, options = {}) {
		const entity = await this.getEntityByIdOrFail(id, options);
		return this.#userMapper.toDTO(entity);
	}

	async getByEmail(email, options = {}) {
		const entity = await this.getEntityByEmail(email, options);

		if (!entity) return null;

		return this.#userMapper.toDTO(entity);
	}

	async getByEmailOrFail(email, options = {}) {
		const entity = await this.getEntityByEmail(email, options);

		this.#checkEntityOrFail(entity);

		return this.#userMapper.toDTO(entity);
	}

	async existsByEmail(email) {
		const entity = await this.#userRepository.findOne({ email });
		return !!entity;
	}

	async comparePassword(hashedPassword, plaintextPassword) {
		return this.#passwordService.comparePassword(plaintextPassword, hashedPassword);
	}

	async getStats() {
		return this.#userStatsService.calculateStats();
	}
}