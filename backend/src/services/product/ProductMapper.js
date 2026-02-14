import {IProductMapper} from "../../interfaces/mappers/IProductMapper.js";
import {ProductDTO, ShortProductDTO} from "../../domain/index.js";

/**
 * @augments IProductMapper
 * @description Concrete implementation of the IProductMapper interface.
 */
export class ProductMapper extends IProductMapper {
	toDTO(entity, categoryDTO) {
		return new ProductDTO(entity, categoryDTO);
	}

	toShortDTO(entity) {
		return new ShortProductDTO(entity);
	}

	toShortDTOs(entities) {
		return entities.map(entity => this.toShortDTO(entity));
	}
}