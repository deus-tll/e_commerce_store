import {IProductCacheManager} from "../../interfaces/product/IProductCacheManager.js";
import {ProductCacheService} from "../../cache/ProductCacheService.js";
import {IProductRepository} from "../../interfaces/repositories/IProductRepository.js";
import {IProductMapper} from "../../interfaces/mappers/IProductMapper.js";

/**
 * @augments IProductCacheManager
 * @description Manages the high-level cache interaction (read-through/write-through) for featured product data.
 */
export class ProductCacheManager extends IProductCacheManager {
	/** @type {ProductCacheService} */ #productCacheService;
	/** @type {IProductRepository} */ #productRepository;
	/** @type {IProductMapper} */ #productMapper;

	/**
	 * @param {ProductCacheService} productCacheService
	 * @param {IProductRepository} productRepository
	 * @param {IProductMapper} productMapper
	 */
	constructor(productCacheService, productRepository, productMapper) {
		super();
		this.#productCacheService = productCacheService;
		this.#productRepository = productRepository;
		this.#productMapper = productMapper;
	}

	/**
	 * Internal helper to fetch featured products from the repository and save them to the cache.
	 * @returns {Promise<ProductDTO[]>}
	 */
	async #fetchAndSetFeaturedProducts() {
		const featuredEntities = await this.#productRepository.findByFeaturedStatus(true);
		const featuredDTOs = await Promise.all(
			featuredEntities.map(entity => this.#productMapper.toDTO(entity))
		);
		await this.#productCacheService.setFeaturedProducts(featuredDTOs);
		return featuredDTOs;
	}

	async getFeaturedProducts() {
		const cachedDTOs = await this.#productCacheService.getFeaturedProducts();
		if (cachedDTOs) {
			return cachedDTOs;
		}

		return await this.#fetchAndSetFeaturedProducts();
	}

	async updateFeaturedProducts() {
		try {
			await this.#fetchAndSetFeaturedProducts();
		}
		catch (error) {
			console.error("Error while updating featured products cache", error.message);
		}
	}
}