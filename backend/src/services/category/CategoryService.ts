import {ICategoryService} from "../../interfaces/category/ICategoryService.js";
import {ICategoryRepository} from "../../interfaces/category/ICategoryRepository.js";
import {ICategoryImageManager} from "../../interfaces/category/ICategoryImageManager.js";
import {ICategoryMapper} from "../../interfaces/category/ICategoryMapper.js";
import {ISlugUtility} from "../../interfaces/utilities/ISlugUtility.js";
import {
	CategoryDTO,
	CategoryPaginationResultDTO,
	CreateCategoryDTO,
	CreateCategoryPersistence,
	PaginationMetadata, UpdateCategoryDTO
} from "../../domain/index.js";

import {EntityNotFoundError} from "../../errors/index.js";

/**
 * Implementation of the abstract contract for Category business operations.
 */
export class CategoryService extends ICategoryService {
	private readonly categoryRepository: ICategoryRepository;
	private readonly categoryImageManager: ICategoryImageManager;
	private readonly categoryMapper: ICategoryMapper;
	private readonly slugUtility: ISlugUtility;

	constructor(
		categoryRepository: ICategoryRepository,
		categoryImageManager: ICategoryImageManager,
		categoryMapper: ICategoryMapper,
		slugUtility: ISlugUtility
	) {
		super();
		this.categoryRepository = categoryRepository;
		this.categoryImageManager = categoryImageManager;
		this.categoryMapper = categoryMapper;
		this.slugUtility = slugUtility;
	}

	async create(data: CreateCategoryDTO): Promise<CategoryDTO> {
		const persistenceData: CreateCategoryPersistence = {
			name: data.name,
			allowedAttributes: data.allowedAttributes,
			slug: this.slugUtility.generateSlug(data.name),
			image: await this.categoryImageManager.imageDataUploadOnCreateUpdate(
				data.image,
				null
			)
		}

		const createdEntity = await this.categoryRepository.create(persistenceData);
		return this.categoryMapper.toDTO(createdEntity);
	}

	async update(id: string, data: UpdateCategoryDTO): Promise<CategoryDTO> {
		const existingEntity = await this.categoryRepository.findById(id);
		if (!existingEntity) throw new EntityNotFoundError("Category", { id });

		const persistenceData = { ...data.toPersistence() };

		if (data.name !== undefined && data.name !== existingEntity.name) {
			persistenceData.slug = this.slugUtility.generateSlug(data.name);
		}

		if (data.image !== undefined && data.image !== "") {
			persistenceData.image = await this.categoryImageManager.imageDataUploadOnCreateUpdate(
				data.image,
				existingEntity.image
			);
		}

		const updatedCategory = await this.categoryRepository.updateById(id, persistenceData);
		return this.categoryMapper.toDTO(updatedCategory);
	}

	async delete(id: string): Promise<CategoryDTO> {
		const deletedCategory = await this.categoryRepository.deleteById(id);
		await this.categoryImageManager.deleteByUrl(deletedCategory.image);
		return this.categoryMapper.toDTO(deletedCategory);
	}

	async getAll(
		page: number = 1,
		limit: number = 10,
		filters: Record<string, any> = {}
	): Promise<CategoryPaginationResultDTO> {
		const skip = (page - 1) * limit;

		const { results, total } = await this.categoryRepository.findAndCount(filters, skip, limit);

		const pages = Math.ceil(total / limit);
		const categoryDTOs = this.categoryMapper.toDTOs(results);

		return new CategoryPaginationResultDTO({
			categories: categoryDTOs,
			pagination: new PaginationMetadata(page, limit, total, pages)
		});
	}

	async getDTOsByIds(ids: string[]): Promise<CategoryDTO[]> {
		const entities = await this.categoryRepository.findByIds(ids);
		return this.categoryMapper.toDTOs(entities);
	}

	async getById(id: string): Promise<CategoryDTO | null> {
		const category = await this.categoryRepository.findById(id);
		return category ? this.categoryMapper.toDTO(category) : null;
	}

	async getByIdOrFail(id: string): Promise<CategoryDTO> {
		const category = await this.getById(id);
		if (!category) throw new EntityNotFoundError("Category", { id });
		return category;
	}

	async getBySlug(slug: string): Promise<CategoryDTO | null> {
		const category = await this.categoryRepository.findBySlug(slug);
		return category ? this.categoryMapper.toDTO(category) : null;
	}

	async getBySlugOrFail(slug: string): Promise<CategoryDTO> {
		const category = await this.getBySlug(slug);
		if (!category) throw new EntityNotFoundError("Category", { slug });
		return category;
	}
}