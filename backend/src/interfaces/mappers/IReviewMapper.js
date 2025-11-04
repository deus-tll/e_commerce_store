import {ReviewEntity, ReviewDTO} from "../../domain/index.js";

/**
 * @interface IReviewMapper
 * @description Defines the contract for converting Review entities (from Repository)
 * into various DTO forms (for Controllers/Consumers).
 */
export class IReviewMapper {
	/**
	 * Converts a Review entity object to the standard ReviewDTO, resolving dependencies like the User.
	 * @param {ReviewEntity} entity - The Review entity record received from the repository.
	 * @returns {Promise<ReviewDTO>} - The mapped ReviewDTO.
	 */
	async toDTO(entity) { throw new Error("Method not implemented."); }

	/**
	 * Converts an array of Review entities to an array of ReviewDTOs.
	 * @param {ReviewEntity[]} entities - The array of Review entities.
	 * @returns {Promise<ReviewDTO[]>} - A promise that resolves to the mapped array of ReviewDTOs.
	 */
	async toDTOs(entities) { throw new Error("Method not implemented."); }
}