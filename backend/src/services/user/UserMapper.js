import {IUserMapper} from "../../interfaces/mappers/IUserMapper.js";
import {UserDTO, ShortUserDTO} from "../../domain/index.js";

/**
 * Concrete implementation of IUserMapper.
 * Handles all conversion logic for User entities.
 * @augments IUserMapper
 */
export class UserMapper extends IUserMapper {
	toDTO(entity) {
		return new UserDTO(entity);
	}

	toDTOs(entities) {
		return entities.map(entity => this.toDTO(entity));
	}

	toShortDTO(entity) {
		return new ShortUserDTO(entity);
	}
}