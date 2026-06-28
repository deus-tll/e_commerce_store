import {ICategoryRepository} from "./ICategoryRepository.js";
import {CategoryImageManager} from "./CategoryImageManager.js";
import {CategoryMapper} from "./CategoryMapper.js";

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

export class CategoryService {
	constructor(
		private readonly categoryRepository: ICategoryRepository,
		private readonly categoryImageManager: CategoryImageManager
	) {}

	private formDTO(entity?: CategoryEntity | null): CategoryDTO | null {
		return entity ? CategoryMapper.toDTO(entity) : null;
	}

	private formDTORequired(entity: CategoryEntity): CategoryDTO {
		return CategoryMapper.toDTO(entity);
	}

	private formDTOsRequired(entities: CategoryEntity[]): CategoryDTO[] {
		return CategoryMapper.toDTOs(entities);
	}

	private async getEntityByIdOrFail(id: string): Promise<CategoryEntity> {
		const entity = await this.categoryRepository.findById(id);
		if (!entity) throw new EntityNotFoundError("Category", { id });
		return entity;
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
		return this.formDTORequired(createdEntity);
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

		const updatedEntity = await this.categoryRepository.updateById(id, persistenceData);
		return this.formDTORequired(updatedEntity);
	}

	async delete(id: string): Promise<CategoryDTO> {
		const deletedEntity = await this.categoryRepository.deleteById(id);
		await this.categoryImageManager.deleteByUrl(deletedEntity.image);
		return this.formDTORequired(deletedEntity);
	}

	async getAll(
		page: number = 1,
		limit: number = 10,
		filters: CategoryFiltersInput = {}
	): Promise<CategoryPaginationResultDTO> {
		const skip = (page - 1) * limit;

		const { results, total } = await this.categoryRepository.findAndCount(filters, skip, limit);

		const pages = Math.ceil(total / limit);
		const dtos = CategoryMapper.toDTOs(results);

		return new CategoryPaginationResultDTO(
			dtos,
			new PaginationMetadata(page, limit, total, pages)
		);
	}

	async getDTOsByIds(ids: string[]): Promise<CategoryDTO[]> {
		const entities = await this.categoryRepository.findByIds(ids);
		return this.formDTOsRequired(entities);
	}

	async getById(id: string): Promise<CategoryDTO | null> {
		const entity = await this.categoryRepository.findById(id);
		return this.formDTO(entity);
	}

	async getByIdOrFail(id: string): Promise<CategoryDTO> {
		const entity = await this.getEntityByIdOrFail(id);
		return this.formDTORequired(entity);
	}

	async getBySlug(slug: string): Promise<CategoryDTO | null> {
		const entity = await this.categoryRepository.findBySlug(slug);
		return this.formDTO(entity);
	}

	async getBySlugOrFail(slug: string): Promise<CategoryDTO> {
		const dto = await this.getBySlug(slug);

		if (!dto) throw new EntityNotFoundError("Category", { slug });

		return dto;
	}
}