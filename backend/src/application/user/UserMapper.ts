import {UserEntity} from "../../entities/user/UserEntity.js";
import {UserDTO, ShortUserDTO} from "../types/user.js";

export class UserMapper {
	static toDTO(entity: UserEntity): UserDTO {
		return new UserDTO(entity);
	}

	static toDTOs(entities: UserEntity[]): UserDTO[] {
		return entities.map(entity => this.toDTO(entity));
	}

	static toShortDTO(entity: UserEntity): ShortUserDTO {
		return new ShortUserDTO(entity);
	}

	static toShortDTOs(entities: UserEntity[]): ShortUserDTO[] {
		return entities.map(entity => this.toShortDTO(entity));
	}
}