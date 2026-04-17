import {IOrderMapper} from "../../interfaces/mappers/IOrderMapper.js";
import {OrderDTO} from "../../domain/index.js";

/**
 * Concrete implementation of the IOrderMapper interface.
 * @augments IOrderMapper
 */
export class OrderMapper extends IOrderMapper {
	toDTO(entity, shortUserDTO) {
		return new OrderDTO(entity, shortUserDTO);
	}
}