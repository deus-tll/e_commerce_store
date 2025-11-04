import {ICartMapper} from "../../interfaces/mappers/ICartMapper.js";
import {IProductService} from "../../interfaces/product/IProductService.js";
import {CartDTO, CartItemDTO} from "../../domain/index.js";

/**
 * Concrete implementation of the ICartMapper interface.
 * @augments ICartMapper
 */
export class CartMapper extends ICartMapper {
	/** @type {IProductService} */ #productService;

	/**
	 * @param {IProductService} productService - The product service dependency.
	 */
	constructor(productService) {
		super();
		this.#productService = productService;
	}

	async #convertToFullDTO(entity) {
		const productIds = entity.items.map(item => item.productId);

		const productDTOs = await this.#productService.getShortDTOsByIds(productIds);

		const productMap = new Map(productDTOs.map(p => [p.id, p]));

		const itemDTOs = entity.items.map(item => {
			const product = productMap.get(item.productId);

			if (!product) {
				// If a product is not found (e.g., it was deleted), skip this item
				return null;
			}

			return new CartItemDTO({
				product: product,
				quantity: item.quantity
			});
		}).filter(item => item !== null);

		return new CartDTO({
			id: entity.id,
			userId: entity.userId,
			items: itemDTOs,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt
		});
	}

	async toDTO(entity) {
		return await this.#convertToFullDTO(entity);
	}

	async toItemDTOs(entity) {
		const cartDTO = await this.#convertToFullDTO(entity);
		return cartDTO.items;
	}
}