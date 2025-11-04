import {IReviewMapper} from "../../interfaces/mappers/IReviewMapper.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {IUserMapper} from "../../interfaces/mappers/IUserMapper.js";
import {ReviewDTO} from "../../domain/index.js";

/**
 * Concrete implementation of the IReviewMapper interface.
 * @augments IReviewMapper
 */
export class ReviewMapper extends IReviewMapper {
	/** @type {IUserService} */ #userService;
	/** @type {IUserMapper} */ #userMapper;

	/**
	 * @param {IUserService} userService - The user service dependency.
	 * @param {IUserMapper} userMapper - The user mapper dependency.
	 */
	constructor(userService, userMapper) {
		super();
		this.#userService = userService;
		this.#userMapper = userMapper;
	}

	async toDTO(entity) {
		const userEntity = await this.#userService.getEntityById(entity.userId);

		let shortUserDTO = null;

		if (userEntity) {
			shortUserDTO = this.#userMapper.toShortDTO(userEntity);
		}

		return new ReviewDTO(entity, shortUserDTO);
	}

	async toDTOs(entities) {
		return Promise.all(
			entities.map(entity => this.toDTO(entity))
		);
	}
}