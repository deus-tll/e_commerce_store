import {CategoryEntity} from "../../entities/category/CategoryEntity.js";
import {CreateCategoryPersistence, UpdateCategoryPersistence} from "../dtos/category.dto.js";
import {RepositoryPaginationResult} from "../dtos/shared.dto.js";


/**
 * Abstract contract for Category persistence operations.
 */
export abstract class ICategoryRepository {
	abstract create(data: CreateCategoryPersistence): Promise<CategoryEntity>;
	abstract updateById(id: string, data: UpdateCategoryPersistence): Promise<CategoryEntity>;
	abstract deleteById(id: string): Promise<CategoryEntity>;
	abstract findById(id: string): Promise<CategoryEntity | null>
	abstract findBySlug(slug: string): Promise<CategoryEntity | null>
	abstract findByIds(ids: string[]): Promise<CategoryEntity[]>;
	abstract findAndCount(
		query: Record<string, any>,
		skip: number,
		limit: number
	): Promise<RepositoryPaginationResult<CategoryEntity>>;
}