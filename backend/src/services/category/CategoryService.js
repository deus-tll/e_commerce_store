import {ICategoryService} from "../../interfaces/category/ICategoryService.js";
import {ICategoryRepository} from "../../interfaces/repositories/ICategoryRepository.js";
import {ICategoryImageManager} from "../../interfaces/category/ICategoryImageManager.js";
import {ICategoryMapper} from "../../interfaces/mappers/ICategoryMapper.js";
import {ISlugGenerator} from "../../interfaces/utils/ISlugGenerator.js";
import {CategoryPaginationResultDTO, PaginationMetadata} from "../../domain/index.js";

import {EntityNotFoundError} from "../../errors/index.js";

/**
 * Agnostic business logic layer for category operations.
 * @augments ICategoryService
 */
export class CategoryService extends ICategoryService {
	/** @type {ICategoryRepository} */ #categoryRepository;
	/** @type {ICategoryImageManager} */ #categoryImageManager;
	/** @type {ICategoryMapper} */ #categoryMapper;
	/** @type {ISlugGenerator} */ #slugGenerator;

	/**
	 * @param {ICategoryRepository} categoryRepository
	 * @param {ICategoryImageManager} categoryImageManager
	 * @param {ICategoryMapper} categoryMapper
	 * @param {ISlugGenerator} slugGenerator
	 */
	constructor(categoryRepository, categoryImageManager, categoryMapper, slugGenerator) {
		super();
		this.#categoryRepository = categoryRepository;
		this.#categoryImageManager = categoryImageManager;
		this.#categoryMapper = categoryMapper;
		this.#slugGenerator = slugGenerator;
	}

	async create(data) {
		const generatedSlug = this.#slugGenerator.generateSlug(data.name);
		const processedImage = await this.#categoryImageManager.handleImageUpdate(
			data.image,
			null
		);

		const persistenceData = {
			...data.toPersistence(),
			slug: generatedSlug,
			image: processedImage
		}

		const createdEntity = await this.#categoryRepository.create(persistenceData);

		return this.#categoryMapper.toDTO(createdEntity);
	}

	async update(id, data) {
		const existingEntity = await this.#categoryRepository.findById(id);
		if (!existingEntity) throw new EntityNotFoundError("Category", { id });

		const persistenceData = { ...data.toPersistence() };

		if (data.name !== undefined && data.name !== existingEntity.name) {
			persistenceData.slug = this.#slugGenerator.generateSlug(data.name);
		}

		if (data.image !== undefined && data.image !== "") {
			persistenceData.image = await this.#categoryImageManager.handleImageUpdate(
				data.image,
				existingEntity.image
			);
		}

		const updatedCategory = await this.#categoryRepository.updateById(id, persistenceData);

		return this.#categoryMapper.toDTO(updatedCategory);
	}

	async delete(id) {
		const deletedCategory = await this.#categoryRepository.deleteById(id);

		await this.#categoryImageManager.deleteImage(deletedCategory.image);

		return this.#categoryMapper.toDTO(deletedCategory);
	}

	async getAll(page = 1, limit = 10, filters = {}) {
		const skip = (page - 1) * limit;

		const { results, total } = await this.#categoryRepository.findAndCount(filters, skip, limit);

		const pages = Math.ceil(total / limit);
		const categoryDTOs = this.#categoryMapper.toDTOs(results);

		return new CategoryPaginationResultDTO(
			categoryDTOs,
			new PaginationMetadata(page, limit, total, pages)
		);
	}

	async getDTOsByIds(ids) {
		const entities = await this.#categoryRepository.findByIds(ids);
		return this.#categoryMapper.toDTOs(entities);
	}

	async getById(id) {
		const category = await this.#categoryRepository.findById(id);
		return category ? this.#categoryMapper.toDTO(category) : null;
	}

	async getByIdOrFail(id) {
		const category = await this.getById(id);

		if (!category) {
			throw new EntityNotFoundError("Category", { id });
		}

		return category;
	}

	async getBySlug(slug) {
		const category = await this.#categoryRepository.findBySlug(slug);
		return category ? this.#categoryMapper.toDTO(category) : null;
	}

	async getBySlugOrFail(slug) {
		const category = await this.getBySlug(slug);

		if (!category) {
			throw new EntityNotFoundError("Category", { slug });
		}

		return category;
	}
}