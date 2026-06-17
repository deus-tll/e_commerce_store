import {CategoryEntity} from "../../entities/category/CategoryEntity.js";
import {CategoryDTO} from "../types/category.js";

export class CategoryMapper {
    static toDTO(entity: CategoryEntity): CategoryDTO {
        return new CategoryDTO(entity);
    }

    static toDTOs(entities: readonly CategoryEntity[]): CategoryDTO[] {
        return entities.map(entity => this.toDTO(entity));
    }
}