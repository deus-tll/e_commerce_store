import {CategoryDTO, CategoryPaginationResultDTO, CreateCategoryDTO, UpdateCategoryDTO} from "../../domain/index.js";

/**
 * Abstract contract for Category business operations.
 */
export abstract class ICategoryService {
	/**
	 * Creates a new category and generates a unique URL slug based on the name.
	 */
	abstract create(data: CreateCategoryDTO): Promise<CategoryDTO>;
	abstract update(id: string, data: UpdateCategoryDTO): Promise<CategoryDTO>;

	/**
	 * Deletes a category and its associated image from storage.
	 */
	abstract delete(id: string): Promise<CategoryDTO>;
	abstract getAll(
		page: number,
		limit: number,
		filters: Record<string, any>
	): Promise<CategoryPaginationResultDTO>;
	abstract getDTOsByIds(ids: string[]): Promise<CategoryDTO[]>;
	abstract getById(id: string): Promise<CategoryDTO | null>;
	abstract getByIdOrFail(id: string): Promise<CategoryDTO>;
	abstract getBySlug(slug: string): Promise<CategoryDTO | null>;
	abstract getBySlugOrFail(slug: string): Promise<CategoryDTO>;
}