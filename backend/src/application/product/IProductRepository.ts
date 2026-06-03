import {ProductEntity} from "../../entities/product/ProductEntity.js";
import {RepositoryPaginationResult} from "../types/shared.js";
import {
	AttributeFacetDTO,
	ProductCountFilters,
	ProductCreatePersistence,
	ProductFiltersPersistence,
	ProductUpdatePersistence
} from "../types/product.js";

export abstract class IProductRepository {
	abstract create(data: ProductCreatePersistence): Promise<ProductEntity>;
	abstract updateById(id: string, data: ProductUpdatePersistence): Promise<ProductEntity>;

	/**
	 * Atomically updates product rating statistics based on a review change.
	 * @param id
	 * @param ratingChange
	 * @param totalReviewsChange - +1 for create, -1 for delete, 0 for update.
	 * @param oldRating
	 */
	abstract updateRatingStats(
		id: string,
		ratingChange: number,
		totalReviewsChange: number,
		oldRating: number
	): Promise<void>;
	/**
	 * Finds all products with average rating greater than or equal to provided value and sets it to be featured
	 */
	abstract markAsFeaturedRatingBased(minRating: number): Promise<void>;
	abstract toggleFeatured(id: string): Promise<ProductEntity>;
	abstract deleteById(id: string): Promise<ProductEntity>;

	abstract findById(id: string): Promise<ProductEntity | null>;
	abstract findByIds(ids: string[]): Promise<ProductEntity[]>;
	abstract findByFeaturedStatus(isFeatured: boolean): Promise<ProductEntity[]>;
	abstract findByCategoryIdsExcludingProductIds(
		size: number,
		categoryIds: string[],
		excludedIds: string[]
	): Promise<ProductEntity[]>;
	abstract findAndCount(
		filters: ProductFiltersPersistence,
		skip: number,
		limit: number,
	): Promise<RepositoryPaginationResult<ProductEntity>>;

	abstract count(filters: ProductCountFilters): Promise<number>;
	abstract exists(id: string): Promise<boolean>;
	abstract getAttributeFacets(categoryId: string): Promise<AttributeFacetDTO[]>;
}