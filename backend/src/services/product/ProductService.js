import {IProductService} from "../../interfaces/product/IProductService.js";
import {IProductRepository} from "../../interfaces/repositories/IProductRepository.js";
import {ICategoryService} from "../../interfaces/category/ICategoryService.js";
import {IProductImageManager} from "../../interfaces/product/IProductImageManager.js";
import {IProductMapper} from "../../interfaces/mappers/IProductMapper.js";
import {IProductCacheManager} from "../../interfaces/product/IProductCacheManager.js";
import {PaginationMetadata, ProductPaginationResultDTO} from "../../domain/index.js";

import {NotFoundError} from "../../errors/apiErrors.js";

const RECOMMENDED_PRODUCTS_SIZE = 4;

/**
 * @augments IProductService
 * @description Agnostic business logic layer for product operations.
 * Coordinates between the Product Repository, Category Service, and Product Storage Service.
 */
export class ProductService extends IProductService {
	/** @type {IProductRepository} */ #productRepository;
	/** @type {ICategoryService} */ #categoryService;
	/** @type {IProductImageManager} */ #productImageManager;
	/** @type {IProductCacheManager} */ #productCacheManager;
	/** @type {IProductQueryBuilder} */ #productQueryBuilder;
	/** @type {IProductMapper} */ #productMapper;

	/**
	 * @param {IProductRepository} productRepository
	 * @param {ICategoryService} categoryService
	 * @param {IProductImageManager} productImageManager
	 * @param {IProductCacheManager} productCacheManager
	 * @param {IProductQueryBuilder} productQueryBuilder
	 * @param {IProductMapper} productMapper
	 */
	constructor(productRepository, categoryService, productImageManager, productCacheManager, productQueryBuilder, productMapper) {
		super();
		this.#productRepository = productRepository;
		this.#categoryService = categoryService;
		this.#productImageManager = productImageManager;
		this.#productCacheManager = productCacheManager;
		this.#productQueryBuilder = productQueryBuilder;
		this.#productMapper = productMapper;
	}

	async create(data) {
		await this.#categoryService.getByIdOrFail(data.categoryId);

		data.images = await this.#productImageManager.processNewImagesForCreation(data.images);

		const createdEntity = await this.#productRepository.create(data);

		if (createdEntity.isFeatured) {
			await this.#productCacheManager.updateFeaturedProducts();
		}

		return await this.#productMapper.toDTO(createdEntity);
	}

	async update(id, data) {
		// 1. Get existing product entity to manage old images
		const existingEntity = await this.#productRepository.findById(id);
		if (!existingEntity) {
			throw new NotFoundError("Product not found.");
		}

		// 2. Check if category exists, if it is being updated
		if (data.categoryId) {
			await this.#categoryService.getByIdOrFail(data.categoryId);
		}

		// 3. Handle image updates: Preserve old, upload new, delete removed
		if (data.images !== undefined) {
			const { finalImagesData, urlsToDelete } = await this.#productImageManager.handleImageUpdate(
				data.images,
				existingEntity.images
			);

			await this.#productImageManager.deleteImagesByUrls(urlsToDelete);

			data.images = finalImagesData;
		}

		// 4. Update product entity
		const updatedEntity = await this.#productRepository.updateById(id, data);
		if (!updatedEntity) {
			throw new NotFoundError("Product not found after attempted update.");
		}

		// 5. Update cache if the product was or is now featured
		if (existingEntity.isFeatured || updatedEntity.isFeatured) {
			await this.#productCacheManager.updateFeaturedProducts();
		}

		return await this.#productMapper.toDTO(updatedEntity);
	}

	async toggleFeatured(id) {
		const updatedEntity = await this.#productRepository.toggleFeatured(id);

		await this.#productCacheManager.updateFeaturedProducts();

		return await this.#productMapper.toDTO(updatedEntity);
	}

	async updateRatingStats(productId, ratingChange, totalReviewsChange, oldRating = 0) {
		await this.#productRepository.updateRatingStats(
			productId,
			ratingChange,
			totalReviewsChange,
			oldRating
		);
	}

	async delete(id) {
		const deletedEntity = await this.#productRepository.deleteById(id);

		if (!deletedEntity) {
			throw new NotFoundError("Product not found");
		}

		if (deletedEntity.isFeatured) {
			await this.#productCacheManager.updateFeaturedProducts();
		}

		await this.#productImageManager.deleteProductImages(deletedEntity.images);

		return await this.#productMapper.toDTO(deletedEntity);
	}

	async getAll(page = 1, limit = 10, filters = {}) {
		const skip = (page - 1) * limit;
		const query = await this.#productQueryBuilder.buildQuery(filters);

		if (query === null) {
			const emptyMetadata = new PaginationMetadata(page, limit, 0, 0);
			return new ProductPaginationResultDTO([], emptyMetadata);
		}

		const repositoryPaginationResult = await this.#productRepository.findAndCount(query, skip, limit, { createdAt: -1 });

		const total = repositoryPaginationResult.total;
		const pages = Math.ceil(total / limit);

		const productDTOs = await this.#productMapper.toDTOs(repositoryPaginationResult.results);
		const paginationMetadata = new PaginationMetadata(page, limit, total, pages);

		return new ProductPaginationResultDTO(productDTOs, paginationMetadata);
	}

	async getById(id) {
		const entity = await this.#productRepository.findById(id);

		if (!entity) return null;

		return await this.#productMapper.toDTO(entity);
	}

	async getByIdOrFail(id) {
		const entityDTO = await this.getById(id);

		if (!entityDTO) {
			throw new NotFoundError("Product not found");
		}

		return entityDTO;
	}

	async getFeatured() {
		return await this.#productCacheManager.getFeaturedProducts();
	}

	async getRecommended() {
		const entities = await this.#productRepository.findRecommended(RECOMMENDED_PRODUCTS_SIZE);
		return await this.#productMapper.toDTOs(entities);
	}

	async getShortDTOsByIds(ids) {
		const entities = await this.#productRepository.findByIds(ids);
		return this.#productMapper.toShortDTOs(entities);
	}

	async exists(id) {
		return await this.#productRepository.existsById(id);
	}
}