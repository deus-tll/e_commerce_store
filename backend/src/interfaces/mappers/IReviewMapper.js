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
	 * @param {ShortUserDTO} shortUserDTO - Short user dto for enriching review.
	 * @returns {ReviewDTO} - The mapped ReviewDTO.
	 */
	toDTO(entity, shortUserDTO) { throw new Error("Method not implemented."); }
}