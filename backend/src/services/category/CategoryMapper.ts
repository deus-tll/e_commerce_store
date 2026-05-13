import {ICategoryMapper} from "../../interfaces/category/ICategoryMapper.js";
import {CategoryDTO, CategoryEntity} from "../../domain/index.js";

/**
 * Implementation of the abstract contract for Category mapping operations.
 */
export class CategoryMapper extends ICategoryMapper {
	toDTO(entity: CategoryEntity): CategoryDTO {
		return new CategoryDTO(entity);
	}

	toDTOs(entities: CategoryEntity[]): CategoryDTO[] {
		return entities.map(entity => this.toDTO(entity));
	}
}