import {ICartService} from "../../interfaces/cart/ICartService.js";
import {ICartRepository} from "../../interfaces/repositories/ICartRepository.js";
import {IProductService} from "../../interfaces/product/IProductService.js";
import {ICartMapper} from "../../interfaces/mappers/ICartMapper.js";

import {BadRequestError, InternalServerError} from "../../errors/apiErrors.js";

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

	async #formItemDTOs(entity) {
		const productIds = entity.items.map(item => item.productId);
		const shortProductDTOs = await this.#productService.getShortDTOsByIds(productIds);

		const cartDTO = this.#cartMapper.toDTO(entity, shortProductDTOs);

		return cartDTO.items;
	}

	async addProduct(userId, productId) {
		const product = await this.#productService.getByIdOrFail(productId);
		if (product.stock < 1) {
			throw new BadRequestError("Product is out of stock.");
		}

		const updatedEntity = await this.#cartRepository.addItemOrIncrement(userId, productId);

		return await this.#formItemDTOs(updatedEntity);
	}

	async removeProduct(userId, productId) {
		const updatedEntity = await this.#cartRepository.removeItem(userId, productId);

		if (!updatedEntity) {
			throw new InternalServerError("Something went wrong on the server while removing product from cart.");
		}

		return await this.#formItemDTOs(updatedEntity);
	}

	async updateProductQuantity(userId, productId, quantity) {
		if (quantity < 0) {
			throw new BadRequestError("Quantity must be non-negative.");
		}

		if (quantity === 0) {
			const updatedEntity = await this.#cartRepository.removeItem(userId, productId);
			return updatedEntity ? await this.#formItemDTOs(updatedEntity) : [];
		}

		const product = await this.#productService.getByIdOrFail(productId);
		if (product.stock < quantity) {
			throw new BadRequestError(`Only ${product.stock} items available in stock.`);
		}

		const updatedEntity = await this.#cartRepository.updateItemQuantity(userId, productId, quantity);

		if (!updatedEntity) {
			throw new InternalServerError("Something went wrong on the server while updating quantity of the item.");
		}

		return await this.#formItemDTOs(updatedEntity);
	}

	async clear(userId) {
		const updatedEntity = await this.#cartRepository.updateItemsByUserId(userId, []);

		if (!updatedEntity) {
			return [];
		}

		return [];
	}

	async getCartItems(userId) {
		const cartEntity = await this.#cartRepository.findByUserId(userId);

		if (!cartEntity) {
			return [];
		}

		return await this.#formItemDTOs(cartEntity);
	}
}