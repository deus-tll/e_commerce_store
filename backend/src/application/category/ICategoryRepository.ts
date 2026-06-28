import {CategoryEntity} from "../../entities/category/CategoryEntity.js";
import {CategoryFiltersPersistence, CategoryCreatePersistence, CategoryUpdatePersistence} from "../types/category.js";
import {RepositoryPaginationResult} from "../types/shared.js";

export abstract class ICategoryRepository {
	abstract create(data: CategoryCreatePersistence): Promise<CategoryEntity>;
	abstract updateById(id: string, data: CategoryUpdatePersistence): Promise<CategoryEntity>;
	abstract deleteById(id: string): Promise<CategoryEntity>;
	abstract findById(id: string): Promise<CategoryEntity | null>
	abstract findBySlug(slug: string): Promise<CategoryEntity | null>
	abstract findByIds(ids: string[]): Promise<CategoryEntity[]>;
	abstract findAndCount(
		filters: CategoryFiltersPersistence,
		skip: number,
		limit: number
	): Promise<RepositoryPaginationResult<CategoryEntity>>;
}