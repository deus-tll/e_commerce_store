import {IProductRepository} from "./IProductRepository.js";
import {CategoryService} from "../category/CategoryService.js";
import {ProductCacheRepository} from "../../infrastructure/repositories/cache/ProductCacheRepository.js";
import {ProductImageManager} from "./ProductImageManager.js";

import {ProductAttribute, ProductImage} from "../../entities/product/ProductValueObjects.js";
import {ProductEntity} from "../../entities/product/ProductEntity.js";
import {
	AttributeFacetDTO, ProductCreateInput, ProductCreatePersistence,
	ProductDTO, ProductFiltersInput, ProductPaginationResultDTO,
	ShortProductDTO, ProductUpdateInput, ProductUpdatePersistence
} from "../types/product.js";
import {CategoryDTO} from "../types/category.js";
import {PaginationMetadata} from "../types/shared.js";

import {EntityNotFoundError} from "../../errors/index.js";

import {parseProductQuery} from "./parseProductQuery.js";
import {removeUndefinedFields} from "../../utils/object.js";

export class ProductService {
	constructor(
		private readonly productRepository: IProductRepository,
		private readonly categoryService: CategoryService,
		private readonly productCacheRepository: ProductCacheRepository,
		private readonly productImageManager: ProductImageManager,
		private readonly recommendationsInCartSize: number
	) {}

	private async formProductDTO(entity: ProductEntity, categoryDTO?: CategoryDTO): Promise<ProductDTO> {
		const finalCategoryDTO = categoryDTO
			? categoryDTO
			: await this.categoryService.getById(entity.categoryId);

		return new ProductDTO(entity, finalCategoryDTO);
	}

	private async formProductDTOs(entities: ProductEntity[]): Promise<ProductDTO[]> {
		const uniqueCategoryIds = [
			...new Set(entities.map(entity => entity.categoryId).filter(Boolean))
		];
		const categoryDTOs = await this.categoryService.getDTOsByIds(uniqueCategoryIds);
		const categoryMap = new Map(categoryDTOs.map(dto => [dto.id, dto]));

		return entities.map(entity => {
			const categoryDTO = categoryMap.get(entity.categoryId);
			return new ProductDTO(entity, categoryDTO);
		});
	}

	/**
	 * Centralized logic to sync cache.
	 */
	private async refreshFeaturedCache(): Promise<ProductDTO[]> {
		const entities = await this.productRepository.findByFeaturedStatus(true);
		const dtos = await this.formProductDTOs(entities);
		await this.productCacheRepository.setFeaturedProducts(dtos);

		return dtos;
	}

	/**
	 * Filters a list of attributes, keeping only those allowed by the category.
	 */
	private filterAttributes(allowedAttributeNames: readonly string[], attributes: readonly ProductAttribute[]): ProductAttribute[] {
		if (!attributes || attributes.length === 0) return [];
		if (!allowedAttributeNames || allowedAttributeNames.length === 0) return [];

		const allowedSet = new Set(allowedAttributeNames);
		return attributes.filter(attr => allowedSet.has(attr.name));
	}

	/**
	 * Handle Category/Attribute logic if category is changing OR if new attributes are provided
	 */
	private async determineAttributesUpdate(
		existingEntity: ProductEntity,
		categoryId?: string,
		attributes?: ProductAttribute[]
	): Promise<ProductAttribute[] | undefined> {
		if (categoryId) {
			const category = await this.categoryService.getByIdOrFail(categoryId);

			return attributes !== undefined
				? this.filterAttributes(category.allowedAttributes, attributes)
				: [];
		}

		if (attributes !== undefined) {
			const category = await this.categoryService.getByIdOrFail(existingEntity.categoryId);
			return this.filterAttributes(category.allowedAttributes, attributes);
		}

		return undefined;
	}

	/**
	 * Handle image updates: Preserve old, upload new, delete removed
	 */
	private async determineImagesUpdate(
		existingEntity: ProductEntity,
		newImages?: Partial<ProductImage>
	): Promise<{ images?: ProductImage | undefined; urlsToDelete: string[] }> {
		if (newImages === undefined) {
			return { images: undefined, urlsToDelete: [] };
		}

		const imageResult = await this.productImageManager.imageDataUploadOnUpdate(
			newImages,
			existingEntity.images
		);

		return {
			images: imageResult.images,
			urlsToDelete: imageResult.urlsToDelete
		};
	}

	async create(data: ProductCreateInput): Promise<ProductDTO> {
		const categoryDTO = await this.categoryService.getByIdOrFail(data.categoryId);

		const { images, attributes, ...rest } = data;

		const processedImages = await this.productImageManager.imageDataUploadOnCreate(images);
		const filteredAttributes = this.filterAttributes(categoryDTO.allowedAttributes, attributes);

		const persistenceData: ProductCreatePersistence = {
			...rest,
			images: processedImages,
			attributes: filteredAttributes
		};

		try {
			const createdEntity = await this.productRepository.create(persistenceData);

			if (createdEntity.isFeatured) {
				await this.refreshFeaturedCache();
			}

			return await this.formProductDTO(createdEntity, categoryDTO);
		}
		catch (error) {
			if (processedImages) {
				await this.productImageManager.deleteImageData(processedImages);
			}
			throw error;
		}
	}

	async update(id: string, data: ProductUpdateInput): Promise<ProductDTO> {
		const existingEntity = await this.productRepository.findById(id);
		if (!existingEntity) throw new EntityNotFoundError("Product", { id });

		const { attributes: newAttributes, images: newImages, ...restOfData } = data;

		const attributes: ProductAttribute[] | undefined = await this.determineAttributesUpdate(existingEntity, data.categoryId, newAttributes);
		const { images, urlsToDelete } = await this.determineImagesUpdate(existingEntity, newImages);

		const persistenceData: ProductUpdatePersistence = Object.freeze({
			...removeUndefinedFields(restOfData),
			...(attributes !== undefined && { attributes }),
			...(images !== undefined && { images }),
		});

		const updatedEntity = await this.productRepository.updateById(id, persistenceData);

		await this.productImageManager.deleteByUrls(urlsToDelete);

		// Update cache if the product was or is now featured
		if (existingEntity.isFeatured || updatedEntity.isFeatured) {
			await this.refreshFeaturedCache();
		}

		return await this.formProductDTO(updatedEntity);
	}

	async toggleFeatured(id: string): Promise<ProductDTO> {
		const updatedEntity = await this.productRepository.toggleFeatured(id);

		await this.refreshFeaturedCache();

		return await this.formProductDTO(updatedEntity);
	}

	async delete(id: string): Promise<ProductDTO> {
		const deletedEntity = await this.productRepository.deleteById(id);

		if (deletedEntity.isFeatured) {
			await this.refreshFeaturedCache();
		}

		await this.productImageManager.deleteImageData(deletedEntity.images);

		return await this.formProductDTO(deletedEntity);
	}

	async getAll(page: number = 1, limit: number = 10, filters: ProductFiltersInput = {}): Promise<ProductPaginationResultDTO> {
		const skip = (page - 1) * limit;

		let categoryId: string | null = null;

		if (filters.categorySlug) {
			const categoryDTO = await this.categoryService.getBySlug(filters.categorySlug);

			if (!categoryDTO) {
				return new ProductPaginationResultDTO([], new PaginationMetadata(page, limit, 0, 0));
			}
			categoryId = categoryDTO.id;
		}

		const query = parseProductQuery(filters, {categoryId});

		const { sortBy, order } = filters;

		const { results, total } = await this.productRepository.findAndCount(query, skip, limit, { sortBy, order });

		const pages = Math.ceil(total / limit);
		const productDTOs = await this.formProductDTOs(results);

		return new ProductPaginationResultDTO(
			productDTOs,
			new PaginationMetadata(page, limit, total, pages)
		);
	}

	async getByIdOrFail(id: string): Promise<ProductDTO> {
		const entity = await this.productRepository.findById(id);
		if (!entity) {
			throw new EntityNotFoundError("Product", { id });
		}

		const categoryDTO = await this.categoryService.getByIdOrFail(entity.categoryId);

		return await this.formProductDTO(entity, categoryDTO);
	}

	async getFeatured(): Promise<ProductDTO[]> {
		const cached = await this.productCacheRepository.getFeaturedProducts();
		if (cached) return cached;

		return await this.refreshFeaturedCache();
	}

	async getCategoryFacets(categoryId: string): Promise<AttributeFacetDTO[]> {
		return await this.productRepository.getAttributeFacets(categoryId);
	}

	async updateFeaturedByRating(minRating: number): Promise<void> {
		await this.productRepository.markAsFeaturedRatingBased(minRating);
		await this.refreshFeaturedCache();
	}

	async getRecommended(categoryIds: string[], excludedProductIds: string[]): Promise<ProductDTO[]> {
		const entities = await this.productRepository.findByCategoryIdsExcludingProductIds(
			this.recommendationsInCartSize,
			categoryIds,
			excludedProductIds
		);
		return await this.formProductDTOs(entities);
	}

	async getShortDTOsByIds(ids: string[]): Promise<ShortProductDTO[]> {
		const entities = await this.productRepository.findByIds(ids);
		return entities.map(entity => new ShortProductDTO(entity));
	}
}