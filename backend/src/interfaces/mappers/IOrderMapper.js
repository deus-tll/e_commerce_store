import {OrderEntity, OrderDTO} from "../../domain/index.js";

/**
 * @interface IOrderMapper
 * @description Defines the contract for converting Order entities (from Repository)
 * into OrderDTOs (for Controllers/Consumers).
 */
export class IOrderMapper {
	/**
	 * Converts an Order entity object to the standard OrderDTO, resolving dependencies like the User.
	 * @param {OrderEntity} entity - The Order entity record received from the repository.
	 * @returns {Promise<OrderDTO>} - The mapped OrderDTO.
	 */
	async toDTO(entity) { throw new Error("Method not implemented."); }
}