import {BaseCacheRepository} from "./BaseCacheRepository.js";
import {ICacheProvider} from "../../providers/cache/ICacheProvider.js";
import {ProductDTO} from "../../../application/types/product.js";

import {CacheKey, PrefixCacheKey} from "../../../enums/application.js";

export class ProductCacheRepository extends BaseCacheRepository {
	constructor(cacheProvider: ICacheProvider) {
		super(cacheProvider);
	}

	protected override get cacheContextPrefix(): string {
		return PrefixCacheKey.PRODUCTS;
	}

	async getFeaturedProducts(): Promise<ProductDTO[] | null> {
		return await this.get<ProductDTO[]>(CacheKey.FEATURED_PRODUCTS);
	}

	async setFeaturedProducts(productDTOs: ProductDTO[]): Promise<void> {
		await this.set(CacheKey.FEATURED_PRODUCTS, productDTOs);
	}
}