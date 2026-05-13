import {CategoryEntity, CategoryDTO} from "../../domain/index.js";

/**
 * Abstract contract for Category mapping operations.
 */
export abstract class ICategoryMapper {
	abstract toDTO(entity: CategoryEntity): CategoryDTO;
	abstract toDTOs(entities: CategoryEntity[]): CategoryDTO[];
}