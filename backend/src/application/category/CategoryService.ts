import {ICategoryRepository} from "./ICategoryRepository.js";
import {CategoryImageManager} from "./CategoryImageManager.js";

import {CategoryEntity} from "../../entities/category/CategoryEntity.js";
import {
	CategoryDTO, CategoryFiltersInput,
	CategoryPaginationResultDTO,
	CategoryCreateInput,
	CategoryCreatePersistence,
	CategoryUpdateInput, CategoryUpdatePersistence
} from "../types/category.js";
import {PaginationMetadata} from "../types/shared.js";

import {EntityNotFoundError} from "../../errors/index.js";

import {Slug} from "../../utils/slug.js";
import {removeUndefinedFields} from "../../utils/object.js";
import {parseCategoryQuery} from "./parseCategoryQuery.js";

export class CategoryService {
	constructor(
		private readonly categoryRepository: ICategoryRepository,
		private readonly categoryImageManager: CategoryImageManager
	) {}

	private toDTO(entity: CategoryEntity): CategoryDTO {
		return new CategoryDTO(entity);
	}

	toDTOs(entities: CategoryEntity[]): CategoryDTO[] {
		return entities.map(entity => this.toDTO(entity));
	}

	private async getEntityByIdOrFail(id: string): Promise<CategoryEntity> {
		const category = await this.categoryRepository.findById(id);
		if (!category) throw new EntityNotFoundError("Category", { id });
		return category;
	}

	async create(data: CategoryCreateInput): Promise<CategoryDTO> {
		const { name, image, ...rest } = data;

		const persistenceData: CategoryCreatePersistence = Object.freeze({
			...rest,
			name,
			slug: Slug.generate(name),
			image: await this.categoryImageManager.imageDataUploadOnCreateUpdate(
				image,
				null
			)
		} satisfies CategoryCreatePersistence);

		const createdEntity = await this.categoryRepository.create(persistenceData);
		return this.toDTO(createdEntity);
	}

	async update(id: string, data: CategoryUpdateInput): Promise<CategoryDTO> {
		const existingEntity = await this.getEntityByIdOrFail(id);

		const { name: newName, image: newImage, ...restOfData } = data;
		const baseData = removeUndefinedFields(restOfData);

		const nameUpdate = newName !== undefined && newName !== existingEntity.name && {
			name: newName,
			slug: Slug.generate(newName)
		} satisfies Pick<CategoryUpdatePersistence, 'name' | 'slug'>;

		const imageUpdate = newImage !== undefined && newImage !== "" && {
			image: await this.categoryImageManager.imageDataUploadOnCreateUpdate(
				newImage,
				existingEntity.image
			),
		} satisfies Pick<CategoryUpdatePersistence, 'image'>;

		const persistenceData: CategoryUpdatePersistence = Object.freeze({
			...baseData,
			...nameUpdate,
			...imageUpdate
		} satisfies CategoryUpdatePersistence);

		const updatedCategory = await this.categoryRepository.updateById(id, persistenceData);
		return this.toDTO(updatedCategory);
	}

	async delete(id: string): Promise<CategoryDTO> {
		const deletedCategory = await this.categoryRepository.deleteById(id);
		await this.categoryImageManager.deleteByUrl(deletedCategory.image);
		return this.toDTO(deletedCategory);
	}

	async getAll(
		page: number = 1,
		limit: number = 10,
		filters: CategoryFiltersInput = {}
	): Promise<CategoryPaginationResultDTO> {
		const skip = (page - 1) * limit;

		const query = parseCategoryQuery(filters);

		const { results, total } = await this.categoryRepository.findAndCount(query, skip, limit);

		const pages = Math.ceil(total / limit);
		const categoryDTOs = this.toDTOs(results);

		return new CategoryPaginationResultDTO(
			categoryDTOs,
			new PaginationMetadata(page, limit, total, pages)
		);
	}

	async getDTOsByIds(ids: string[]): Promise<CategoryDTO[]> {
		const entities = await this.categoryRepository.findByIds(ids);
		return this.toDTOs(entities);
	}

	async getById(id: string): Promise<CategoryDTO | null> {
		const category = await this.categoryRepository.findById(id);
		return category ? this.toDTO(category) : null;
	}

	async getByIdOrFail(id: string): Promise<CategoryDTO> {
		const category = await this.getById(id);
		if (!category) throw new EntityNotFoundError("Category", { id });
		return category;
	}

	async getBySlug(slug: string): Promise<CategoryDTO | null> {
		const category = await this.categoryRepository.findBySlug(slug);
		return category ? this.toDTO(category) : null;
	}

	async getBySlugOrFail(slug: string): Promise<CategoryDTO> {
		const category = await this.getBySlug(slug);
		if (!category) throw new EntityNotFoundError("Category", { slug });
		return category;
	}
}