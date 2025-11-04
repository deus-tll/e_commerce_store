import {UserEntity, UserDTO, ShortUserDTO} from "../../domain/index.js";

/**
 * @interface IUserMapper
 * @description Defines the contract for converting User entities (from Repository)
 * into various DTO forms (for Controllers/Consumers).
 */
export class IUserMapper {
	/**
	 * Converts a User entity object to the standard UserDTO.
	 * @param {UserEntity} entity - The User entity record received from the repository.
	 * @returns {UserDTO} - The mapped UserDTO.
	 */
	toDTO(entity) { throw new Error("Method not implemented."); }

	/**
	 * Converts an array of User entities to an array of UserDTOs.
	 * @param {UserEntity[]} entities - The array of User entities.
	 * @returns {UserDTO[]} - The mapped array of UserDTOs.
	 */
	toDTOs(entities) { throw new Error("Method not implemented."); }

	/**
	 * Converts a User entity object into a summarized ShortUserDTO.
	 * @param {UserEntity} entity - The User entity record received from the repository.
	 * @returns {ShortUserDTO}  - The mapped ShortUserDTO.
	 */
	toShortDTO(entity) { throw new Error("Method not implemented."); }
}