import {ICartRepository} from "./ICartRepository.js";
import {ProductService} from "../product/ProductService.js";

import {CartEntity} from "../../entities/cart/CartEntity.js";
import {CartDTO, CartItemDTO} from "../types/cart.js";
import {ShortProductDTO} from "../types/product.js";

import {DomainValidationError} from "../../errors/index.js";

export class CartService {
	constructor(
		private readonly cartRepository: ICartRepository,
		private readonly productService: ProductService
	) {}

	private toDTO(entity: CartEntity, shortProductDTOs: ShortProductDTO[]): CartDTO {
		const productMap = new Map(shortProductDTOs.map(p => [p.id, p]));

		const itemDTOs = entity.items.map(item => {
			const product = productMap.get(item.productId);
			if (!product) return null;

			return new CartItemDTO({
				product: product,
				quantity: item.quantity
			});
		}).filter(Boolean);

		return new CartDTO(entity, itemDTOs);
	}

	private async formItemDTOs(entity: CartEntity): Promise<readonly CartItemDTO[]> {
		const productIds = entity.items.map(item => item.productId);
		const shortProductDTOs = await this.productService.getShortDTOsByIds(productIds);

		const cartDTO = this.toDTO(entity, shortProductDTOs);

		return cartDTO.items;
	}

	async addItem(userId: string, productId: string): Promise<readonly CartItemDTO[]> {
		const product = await this.productService.getByIdOrFail(productId);
		if (product.stock < 1) {
			throw new DomainValidationError("Product is out of stock.");
		}

		const updatedEntity = await this.cartRepository.addItemOrIncrementQuantity(userId, productId);

		return await this.formItemDTOs(updatedEntity);
	}

	async removeItem(userId: string, productId: string): Promise<readonly CartItemDTO[]> {
		const updatedEntity = await this.cartRepository.removeItem(userId, productId);

		if (!updatedEntity) return [];

		return await this.formItemDTOs(updatedEntity);
	}

	async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<readonly CartItemDTO[]> {
		if (quantity < 0) {
			throw new DomainValidationError("Quantity must be non-negative.");
		}

		if (quantity === 0) {
			const updatedEntity = await this.cartRepository.removeItem(userId, productId);
			return updatedEntity ? await this.formItemDTOs(updatedEntity) : [];
		}

		const product = await this.productService.getByIdOrFail(productId);
		if (product.stock < quantity) {
			throw new DomainValidationError(`Only ${product.stock} items available in stock.`);
		}

		const updatedEntity = await this.cartRepository.updateItemQuantity(userId, productId, quantity);

		return await this.formItemDTOs(updatedEntity);
	}

	async clear(userId: string): Promise<readonly CartItemDTO[]> {
		await this.cartRepository.updateItemsByUserId(userId, []);
		return [];
	}

	async getCartItems(userId: string): Promise<readonly CartItemDTO[]> {
		const cartEntity = await this.cartRepository.findByUserId(userId);

		if (!cartEntity) {
			return [];
		}

		return await this.formItemDTOs(cartEntity);
	}
}