import {CategoryEntity} from "../../entities/category/CategoryEntity.js";
import {CategoryDTO} from "../dtos/category.dto.js";


export class CategoryMapper {
	toDTO(entity: CategoryEntity): CategoryDTO {
		return new CategoryDTO(entity);
	}

	toDTOs(entities: CategoryEntity[]): CategoryDTO[] {
		return entities.map(entity => this.toDTO(entity));
	}
}