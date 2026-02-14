import {CartEntity, CartDTO} from "../../domain/index.js";

/**
 * @interface ICartMapper
 * @description Defines the contract for converting Cart entities (from Repository)
 * into CartDTOs (for Controllers/Consumers).
 */
export class ICartMapper {
	/**
	 * Converts a Cart entity object to the standard CartDTO, resolving dependencies like Product details.
	 * @param {CartEntity} entity - The Cart entity record received from the repository.
	 * @param {ShortProductDTO[]} shortProductDTOs - The list of products to enrich cart with items.
	 * @returns {CartDTO} - The mapped CartDTO.
	 */
	toDTO(entity, shortProductDTOs) { throw new Error("Method not implemented."); }
}