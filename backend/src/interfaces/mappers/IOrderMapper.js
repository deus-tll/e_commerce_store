import {OrderEntity, OrderDTO, ShortUserDTO} from "../../domain/index.js";

/**
 * @interface IOrderMapper
 * @description Defines the contract for converting Order entities (from Repository)
 * into OrderDTOs (for Controllers/Consumers).
 */
export class IOrderMapper {
	/**
	 * Converts an Order entity object to the standard OrderDTO, resolving dependencies like the User.
	 * @param {OrderEntity} entity - The Order entity record received from the repository.
	 * @param {ShortUserDTO} shortUserDTO - Short user DTO for enriching order.
	 * @returns {OrderDTO} - The mapped OrderDTO.
	 */
	toDTO(entity, shortUserDTO) { throw new Error("Method not implemented."); }
}