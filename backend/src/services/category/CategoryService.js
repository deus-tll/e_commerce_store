import {ICategoryService} from "../../interfaces/category/ICategoryService.js";
import {ICategoryRepository} from "../../interfaces/repositories/ICategoryRepository.js";
import {ICategoryImageManager} from "../../interfaces/category/ICategoryImageManager.js";
import {ICategoryMapper} from "../../interfaces/mappers/ICategoryMapper.js";
import {ISlugGenerator} from "../../interfaces/utils/ISlugGenerator.js";
import {CategoryPaginationResultDTO, PaginationMetadata} from "../../domain/index.js";

import {NotFoundError} from "../../errors/apiErrors.js";

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
		data.slug = this.#slugGenerator.generateSlug(data.name);

		data.image = await this.#categoryImageManager.handleImageUpdate(
			data.image,
			null
		);

		const createdCategory = await this.#categoryRepository.create(data);
		return this.#categoryMapper.toDTO(createdCategory);
	}

	async update(id, data) {
		const existingCategory = await this.#categoryRepository.findById(id);
		if (!existingCategory) {
			throw new NotFoundError("Category not found");
		}

		if (data.name !== undefined && data.name !== existingCategory.name) {
			data.slug = this.#slugGenerator.generateSlug(data.name);
		}

		if (data.image !== undefined) {
			data.image = await this.#categoryImageManager.handleImageUpdate(
				data.image,
				existingCategory.image
			);
		}

		const updatedCategory = await this.#categoryRepository.updateById(id, data);
		if (!updatedCategory) {
			throw new NotFoundError("Category not found");
		}

		return this.#categoryMapper.toDTO(updatedCategory);
	}

	async delete(id) {
		const deletedCategory = await this.#categoryRepository.deleteById(id);
		if (!deletedCategory) {
			throw new NotFoundError("Category not found");
		}

		await this.#categoryImageManager.deleteImage(deletedCategory.image);

		return this.#categoryMapper.toDTO(deletedCategory);
	}

	async getAll(page = 1, limit = 10) {
		const skip = (page - 1) * limit;
		const repositoryPaginationResult = await this.#categoryRepository.findAndCount(skip, limit);

		const total = repositoryPaginationResult.total;
		const pages = Math.ceil(total / limit);

		const categoryDTOs = this.#categoryMapper.toDTOs(repositoryPaginationResult.results);
		const paginationMetadata = new PaginationMetadata(page, limit, total, pages);

		return new CategoryPaginationResultDTO(categoryDTOs, paginationMetadata);
	}

	async getById(id) {
		const category = await this.#categoryRepository.findById(id);
		return category ? this.#categoryMapper.toDTO(category) : null;
	}

	async getByIdOrFail(id) {
		const category = await this.getById(id);

		if (!category) {
			throw new NotFoundError("Category not found");
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
			throw new NotFoundError("Category not found");
		}

		return category;
	}
}