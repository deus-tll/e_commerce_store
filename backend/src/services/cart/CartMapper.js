import {ICartMapper} from "../../interfaces/mappers/ICartMapper.js";
import {CartEntity, CartDTO, CartItemDTO, ShortProductDTO} from "../../domain/index.js";

/**
 * Concrete implementation of the ICartMapper interface.
 * @augments ICartMapper
 */
export class CartMapper extends ICartMapper {
	/**
	 * @param {CartEntity} entity
	 * @param {ShortProductDTO[]} shortProductDTOs
	 * @returns {CartDTO}
	 */
	#convertToFullDTO(entity, shortProductDTOs) {
		const productMap = new Map(shortProductDTOs.map(p => [p.id, p]));

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
		}).filter(Boolean);

		return new CartDTO({
			id: entity.id,
			userId: entity.userId,
			items: itemDTOs,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt
		});
	}

	toDTO(entity, shortProductDTOs) {
		return this.#convertToFullDTO(entity, shortProductDTOs);
	}
}