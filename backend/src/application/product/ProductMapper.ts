import {ProductEntity} from "../../entities/product/ProductEntity.js";
import {ProductDTO} from "../types/product.js";
import {CategoryDTO} from "../types/category.js";

export class ProductMapper {
    static toDTO(entity: ProductEntity, categoryDTO: CategoryDTO): ProductDTO {
        return new ProductDTO(entity, categoryDTO);
    }

    static toDTOs(entities: ProductEntity[], categoryDTOs: CategoryDTO[]): ProductDTO[] {
        const categoryMap = new Map(categoryDTOs.map(dto => [dto.id, dto]));

        return entities.map(entity => {
            const categoryDTO = categoryMap.get(entity.categoryId);
            return this.toDTO(entity, categoryDTO);
        });
    }
}