import {BaseCacheRepository} from "./BaseCacheRepository.js";
import {ICacheProvider} from "../../providers/cache/ICacheProvider.js";
import {ProductDTO} from "../../../domain/index.js";

import {CacheKeys, PrefixCacheKeys} from "../../../constants/app.js";

export class ProductCacheRepository extends BaseCacheRepository {
	constructor(cacheProvider: ICacheProvider) {
		super(cacheProvider);
	}

	protected override get cacheContextPrefix(): string {
		return PrefixCacheKeys.PRODUCTS;
	}

	async getFeaturedProducts(): Promise<ProductDTO[] | null> {
		return await this.get<ProductDTO[]>(CacheKeys.FEATURED_PRODUCTS);
	}

	async setFeaturedProducts(productDTOs: ProductDTO[]): Promise<void> {
		await this.set(CacheKeys.FEATURED_PRODUCTS, productDTOs);
	}

	async invalidateFeaturedProducts(): Promise<void> {
		await this.delete(CacheKeys.FEATURED_PRODUCTS);
	}
}