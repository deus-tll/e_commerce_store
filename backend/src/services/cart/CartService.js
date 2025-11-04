import {ICartService} from "../../interfaces/cart/ICartService.js";
import {ICartRepository} from "../../interfaces/repositories/ICartRepository.js";
import {IProductService} from "../../interfaces/product/IProductService.js";
import {ICartMapper} from "../../interfaces/mappers/ICartMapper.js";
import {CartEntity, CartItemEntity, CreateCartDTO} from "../../domain/index.js";

import {BadRequestError, NotFoundError} from "../../errors/apiErrors.js";

/**
 * Agnostic business logic layer for cart operations.
 * Coordinates between the Cart Repository and product Service.
 * @augments ICartService
 */
export class CartService extends ICartService {
	/** @type {ICartRepository} */ #cartRepository;
	/** @type {IProductService} */ #productService;
	/** @type {ICartMapper} */ #cartMapper;

	/**
	 * @param {ICartRepository} cartRepository
	 * @param {IProductService} productService
	 * @param {ICartMapper} cartMapper
	 */
	constructor(cartRepository, productService, cartMapper) {
		super();
		this.#cartRepository = cartRepository;
		this.#productService = productService;
		this.#cartMapper = cartMapper;
	}

	/**
	 * Internal helper to fetch the cart entity for a user, creating it if it doesn't exist.
	 * @param {string} userId
	 * @returns {Promise<CartEntity>}
	 */
	async #getOrCreateCartEntity(userId) {
		let cartEntity = await this.#cartRepository.findByUserId(userId);

		if (!cartEntity) {
			const creationData = new CreateCartDTO({ userId: userId, items: [] });
			cartEntity = await this.#cartRepository.create(creationData);
		}
		return cartEntity;
	}

	async addProduct(userId, productId) {
		await this.#getOrCreateCartEntity(userId);

		await this.#productService.getByIdOrFail(productId);

		const updatedEntity = await this.#cartRepository.addItemOrIncrement(userId, productId);

		if (!updatedEntity) {
			throw new NotFoundError("Cart entity not found after creation/update attempt.");
		}

		return await this.#cartMapper.toItemDTOs(updatedEntity);
	}

	async removeProduct(userId, productId) {
		await this.#getOrCreateCartEntity(userId);

		const updatedEntity = await this.#cartRepository.removeItem(userId, productId);

		return await this.#cartMapper.toItemDTOs(updatedEntity);
	}

	async updateProductQuantity(userId, productId, quantity) {
		if (quantity < 0) {
			throw new BadRequestError("Quantity must be non-negative.");
		}

		await this.#getOrCreateCartEntity(userId);

		const updatedEntity = await this.#cartRepository.updateItemQuantity(userId, productId, quantity);

		if (!updatedEntity) {
			if (quantity > 0) {
				throw new NotFoundError('Product not found in cart.');
			}

			const currentCart = await this.#cartRepository.findByUserId(userId);
			return this.#cartMapper.toItemDTOs(currentCart);
		}

		return await this.#cartMapper.toItemDTOs(updatedEntity);
	}

	async clear(userId) {
		const updatedEntity = await this.#cartRepository.updateItemsByUserId(userId, []);

		return await this.#cartMapper.toItemDTOs(updatedEntity);
	}

	async getCartItems(userId) {
		const cartEntity = await this.#getOrCreateCartEntity(userId);

		return await this.#cartMapper.toItemDTOs(cartEntity);
	}
}