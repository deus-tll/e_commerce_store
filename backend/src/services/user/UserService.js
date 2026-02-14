import {IUserService} from "../../interfaces/user/IUserService.js";
import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {IUserTokenService} from "../../interfaces/user/IUserTokenService.js";
import {IUserMapper} from "../../interfaces/mappers/IUserMapper.js";
import {IUserQueryTranslator} from "../../interfaces/user/IUserQueryTranslator.js";
import {UserPaginationResultDTO, PaginationMetadata} from "../../domain/index.js";
import {PasswordService} from "../security/PasswordService.js";

import {ConflictError, InternalServerError, NotFoundError} from "../../errors/apiErrors.js";

/**
 * @augments IUserService
 * @description Agnostic business logic layer for user operations.
 */
export class UserService extends IUserService {
	/** @type {IUserRepository} */ #userRepository;
	/** @type {PasswordService} */ #passwordService;
	/** @type {IUserTokenService} */ #userTokenService;
	/** @type {IUserMapper} */ #userMapper;
	/** @type {IUserQueryTranslator} */ #userQueryTranslator;

	/**
	 * @param {IUserRepository} userRepository
	 * @param {PasswordService} passwordService
	 * @param {IUserTokenService} userTokenService
	 * @param {IUserMapper} userMapper
	 * @param {IUserQueryTranslator} userQueryTranslator
	 */
	constructor(userRepository, passwordService, userTokenService, userMapper, userQueryTranslator) {
		super();
		this.#userRepository = userRepository;
		this.#passwordService = passwordService;
		this.#userTokenService = userTokenService;
		this.#userMapper = userMapper;
		this.#userQueryTranslator = userQueryTranslator;
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
		const persistenceData = {
			...data.toPersistence(),
			password: hashedPassword
		};
		const createdEntity = await this.#userRepository.create(persistenceData);

		return this.#userMapper.toDTO(createdEntity);
	}

	async update(id, data, requester) {
		const persistenceData = data.toPersistence(requester.role);
		const updatedEntity = await this.#userRepository.updateById(id, persistenceData);

		this.#checkEntityOrFail(updatedEntity);

		return this.#userMapper.toDTO(updatedEntity);
	}

	async updateLastLogin(id) {
		const updatedEntity = await this.#userRepository.updateById(id, { lastLogin: new Date() });

		if (!updatedEntity) return null;

		return this.#userMapper.toDTO(updatedEntity);
	}

	async changePassword(entity, newPassword) {
		if (!entity.hashedPassword) {
			throw new InternalServerError("Password hash was not loaded for comparison.");
		}

		const hashedPassword = await this.#passwordService.hashPassword(newPassword);
		const updatedEntity = await this.#userRepository.updateById(entity.id, { password: hashedPassword });

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
		const query = this.#userQueryTranslator.translate(filters);

		const { results, total } = await this.#userRepository.findAndCount(query, skip, limit);

		const pages = Math.ceil(total / limit);
		const userDTOs = this.#userMapper.toDTOs(results);

		return new UserPaginationResultDTO(
			userDTOs,
			new PaginationMetadata(page, limit, total, pages)
		);
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

	async getShortDTOById(id) {
		const entity = await this.getEntityById(id);

		if (!entity) {
			return null;
		}

		return this.#userMapper.toShortDTO(entity);
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

	async getShortDTOsByIds(ids) {
		const entities = await this.#userRepository.findByIds(ids);
		return this.#userMapper.toShortDTOs(entities);
	}

	async existsByEmail(email) {
		const entity = await this.#userRepository.findOne({ email });
		return !!entity;
	}
}