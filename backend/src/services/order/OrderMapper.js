import {IOrderMapper} from "../../interfaces/mappers/IOrderMapper.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {IUserMapper} from "../../interfaces/mappers/IUserMapper.js";
import {OrderDTO} from "../../domain/index.js";

/**
 * Concrete implementation of the IOrderMapper interface.
 * @augments IOrderMapper
 */
export class OrderMapper extends IOrderMapper {
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

		return new OrderDTO(entity, shortUserDTO);
	}
}