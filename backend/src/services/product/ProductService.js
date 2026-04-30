import {IProductService} from "../../interfaces/product/IProductService.js";
import {IProductRepository} from "../../interfaces/repositories/IProductRepository.js";
import {ICategoryService} from "../../interfaces/category/ICategoryService.js";
import {IProductImageManager} from "../../interfaces/product/IProductImageManager.js";
import {IQueryParser} from "../../interfaces/parsers/IQueryParser.js";
import {IProductMapper} from "../../interfaces/mappers/IProductMapper.js";
import {PaginationMetadata, ProductPaginationResultDTO} from "../../domain/index.js";

import {EntityNotFoundError} from "../../errors/index.js";

const RECOMMENDED_PRODUCTS_SIZE = 4;

/**
 * @augments IProductService
 * @description Agnostic business logic layer for product operations.
 * Coordinates between the Product Repository, Category Service, and Product Storage Service.
 */
export class ProductService extends IProductService {
	/** @type {IProductRepository} */ #productRepository;
	/** @type {ICategoryService} */ #categoryService;
	/** @type {ProductCacheManager} */ #productCacheManager;
	/** @type {IProductImageManager} */ #productImageManager;
	/** @type {IQueryParser} */ #productQueryParser;
	/** @type {IProductMapper} */ #productMapper;

	/**
	 * @param {IProductRepository} productRepository
	 * @param {ICategoryService} categoryService
	 * @param {ProductCacheManager} productCacheManager
	 * @param {IProductImageManager} productImageManager
	 * @param {IQueryParser} productQueryParser
	 * @param {IProductMapper} productMapper
	 */
	constructor(productRepository, categoryService, productCacheManager, productImageManager, productQueryParser, productMapper) {
		super();
		this.#productRepository = productRepository;
		this.#categoryService = categoryService;
		this.#productCacheManager = productCacheManager;
		this.#productImageManager = productImageManager;
		this.#productQueryParser = productQueryParser;
		this.#productMapper = productMapper;
	}

	async #formProductDTO(entity) {
		const categoryDTO = await this.#categoryService.getById(entity.categoryId);
		return this.#productMapper.toDTO(entity, categoryDTO);
	}

	async #formProductDTOs(entities) {
		const uniqueCategoryIds = [
			...new Set(entities.map(entity => entity.categoryId).filter(Boolean))
		];
		const categoryDTOs = await this.#categoryService.getDTOsByIds(uniqueCategoryIds);
		const categoryMap = new Map(categoryDTOs.map(dto => [dto.id, dto]));

		return entities.map(entity => {
			const categoryDTO = categoryMap.get(entity.categoryId);
			return this.#productMapper.toDTO(entity, categoryDTO);
		});
	}

	/**
	 * Centralized logic to sync cache.
	 */
	async #refreshFeaturedCache() {
		const entities = await this.#productRepository.findByFeaturedStatus(true);
		const dtos = await this.#formProductDTOs(entities);
		await this.#productCacheManager.setFeaturedProducts(dtos);

		return dtos;
	}

	/**
	 * Filters a list of attributes, keeping only those allowed by the category.
	 * @param {string[]} allowedAttributeNames - Names from the Category entity.
	 * @param {ProductAttribute[]} attributes - Attributes provided in the request.
	 * @returns {ProductAttribute[]} - The filtered list.
	 */
	#filterAttributes(allowedAttributeNames, attributes) {
		if (!attributes || attributes.length === 0) return [];
		if (!allowedAttributeNames || allowedAttributeNames.length === 0) return [];

		const allowedSet = new Set(allowedAttributeNames);
		return attributes.filter(attr => allowedSet.has(attr.name));
	}

	async create(data) {
		const category = await this.#categoryService.getByIdOrFail(data.categoryId);

		const processedImages = await this.#productImageManager.imageDataUploadOnCreate(data.images);
		const filteredAttributes = this.#filterAttributes(category.allowedAttributes, data.attributes);
		const persistenceData = {
			...data.toPersistence(),
			images: processedImages,
			attributes: filteredAttributes
		};

		try {
			const createdEntity = await this.#productRepository.create(persistenceData);

			if (createdEntity.isFeatured) {
				await this.#refreshFeaturedCache();
			}

			return await this.#formProductDTO(createdEntity);
		}
		catch (error) {
			if (processedImages) {
				await this.#productImageManager.deleteImageData(processedImages);
			}
			throw error;
		}
	}

	async update(id, data) {
		// 1. Get existing product entity to manage old images
		const existingEntity = await this.#productRepository.findById(id);
		if (!existingEntity) throw new EntityNotFoundError("Product", { id });

		const persistenceData = { ...data.toPersistence() };
		let urlsToDelete = [];

		// 2. Handle Category/Attribute logic if category is changing OR if new attributes are provided
		if (data.categoryId || data.attributes !== undefined) {
			const catId = data.categoryId || existingEntity.categoryId;
			const category = await this.#categoryService.getByIdOrFail(catId);

			if (data.attributes !== undefined) {
				persistenceData.attributes = this.#filterAttributes(category.allowedAttributes, data.attributes);
			}
		}

		// 3. Handle image updates: Preserve old, upload new, delete removed
		if (data.images !== undefined) {
			const imageResult = await this.#productImageManager.imageDataUploadOnUpdate(
				data.images,
				existingEntity.images
			);

			persistenceData.images = imageResult.finalImagesData;
			urlsToDelete = imageResult.urlsToDelete;
		}

		// 4. Update product entity
		const updatedEntity = await this.#productRepository.updateById(id, persistenceData);

		// 5. Delete no longer used images from storage
		await this.#productImageManager.deleteByUrls(urlsToDelete);

		// 6. Update cache if the product was or is now featured
		if (existingEntity.isFeatured || updatedEntity.isFeatured) {
			await this.#refreshFeaturedCache();
		}

		return await this.#formProductDTO(updatedEntity);
	}

	async toggleFeatured(id) {
		const updatedEntity = await this.#productRepository.toggleFeatured(id);

		await this.#refreshFeaturedCache();

		return await this.#formProductDTO(updatedEntity);
	}

	async delete(id) {
		const deletedEntity = await this.#productRepository.deleteById(id);

		if (deletedEntity.isFeatured) {
			await this.#refreshFeaturedCache();
		}

		await this.#productImageManager.deleteImageData(deletedEntity.images);

		return await this.#formProductDTO(deletedEntity);
	}

	async getAll(page = 1, limit = 10, filters = {}) {
		const skip = (page - 1) * limit;

		let categoryId = null;

		if (filters.categorySlug) {
			const categoryDTO = await this.#categoryService.getBySlug(filters.categorySlug);

			if (!categoryDTO) {
				return new ProductPaginationResultDTO([], new PaginationMetadata(page, limit, 0, 0));
			}
			categoryId = categoryDTO.id;
		}

		const query = this.#productQueryParser.parse(filters, {categoryId});

		const { sortBy, order } = filters;

		const { results, total } = await this.#productRepository.findAndCount(query, skip, limit, { sortBy, order });

		const pages = Math.ceil(total / limit);
		const productDTOs = await this.#formProductDTOs(results);

		return new ProductPaginationResultDTO(
			productDTOs,
			new PaginationMetadata(page, limit, total, pages)
		);
	}

	async getById(id) {
		const entity = await this.#productRepository.findById(id);

		if (!entity) return null;

		return await this.#formProductDTO(entity);
	}

	async getByIdOrFail(id) {
		const entityDTO = await this.getById(id);

		if (!entityDTO) {
			throw new EntityNotFoundError("Product", { id });
		}

		return entityDTO;
	}

	async getFeatured() {
		const cached = await this.#productCacheManager.getFeaturedProducts();
		if (cached) return cached;

		return await this.#refreshFeaturedCache();
	}

	async getCategoryFacets(categoryId) {
		return await this.#productRepository.getAttributeFacets(categoryId);
	}

	async updateFeaturedByRating(minRating) {
		await this.#productRepository.markAsFeaturedRatingBased(minRating);
		await this.#refreshFeaturedCache();
	}

	async getRecommended(categoryIds, excludedIds) {
		const entities = await this.#productRepository.findRecommended(
			RECOMMENDED_PRODUCTS_SIZE,
			categoryIds,
			excludedIds
		);
		return await this.#formProductDTOs(entities);
	}

	async getShortDTOsByIds(ids) {
		const entities = await this.#productRepository.findByIds(ids);
		return this.#productMapper.toShortDTOs(entities);
	}
}