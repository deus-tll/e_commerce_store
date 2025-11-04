import {ICategoryMapper} from "../../interfaces/mappers/ICategoryMapper.js";
import {CategoryDTO} from "../../domain/index.js";

/**
 * Concrete implementation of the ICategoryMapper interface.
 * @augments ICategoryMapper
 */
export class CategoryMapper extends ICategoryMapper {
	toDTO(entity) {
		return new CategoryDTO(entity);
	}

	toDTOs(entities) {
		return entities.map(entity => this.toDTO(entity));
	}
}