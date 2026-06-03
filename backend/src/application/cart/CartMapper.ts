import {CartEntity} from "../../entities/cart/CartEntity.js";
import {CartDTO, CartItemDTO} from "../types/cart.js";
import {ShortProductDTO} from "../types/product.js";

export class CartMapper {
    static toDTO(entity: CartEntity, shortProductDTOs: ShortProductDTO[]): CartDTO {
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
}