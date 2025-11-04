import {CategoryEntity, CategoryDTO} from "../../domain/index.js";

/**
 * @interface ICategoryMapper
 * @description Defines the contract for converting Category entities (from Repository)
 * into various DTO forms (for Controllers/Consumers).
 */
export class ICategoryMapper {
	/**
	 * Converts a Category entity object to the standard CategoryDTO.
	 * @param {CategoryEntity} entity - The Category entity record received from the repository.
	 * @returns {CategoryDTO} - The mapped CategoryDTO.
	 */
	toDTO(entity) { throw new Error("Method not implemented."); }

	/**
	 * Converts an array of Category entities to an array of CategoryDTOs.
	 * @param {CategoryEntity[]} entities - The array of Category entities.
	 * @returns {CategoryDTO[]} - The mapped array of CategoryDTOs.
	 */
	toDTOs(entities) { throw new Error("Method not implemented."); }
}