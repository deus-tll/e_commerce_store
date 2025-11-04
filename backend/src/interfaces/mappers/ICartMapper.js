import {CartEntity, CartDTO, CartItemDTO} from "../../domain/index.js";

/**
 * @interface ICartMapper
 * @description Defines the contract for converting Cart entities (from Repository)
 * into CartDTOs (for Controllers/Consumers).
 */
export class ICartMapper {
	/**
	 * Converts a Cart entity object to the standard CartDTO, resolving dependencies like Product details.
	 * @param {CartEntity} entity - The Cart entity record received from the repository.
	 * @returns {Promise<CartDTO>} - The mapped CartDTO.
	 */
	async toDTO(entity) { throw new Error("Method not implemented."); }

	/**
	 * Converts a Cart entity object into a list of enriched CartItemDTOs.
	 * @param {CartEntity} entity - The Cart entity record received from the repository.
	 * @returns {Promise<CartItemDTO[]>} - The list of enriched cart items.
	 */
	async toItemDTOs(entity) { throw new Error("Method not implemented."); }
}