import {CartEntity} from "../../../../../entities/cart/CartEntity.js";
import {CartItem} from "../../../../../entities/cart/types/CartItem.js";
import {ICartDoc} from "../models/Cart.js";

import {normalizePersistence} from "../utils.js";

export class CartAdapter {
    private static buildEntity(
        data: ReturnType<typeof normalizePersistence<ICartDoc>>
    ): CartEntity {
        const { user, items, ...rest } = data;

        const processedItems = items.map(item => new CartItem({
            productId: item.product?.toString(),
            quantity: item.quantity
        }));

        return new CartEntity({
            ...rest,
            userId: user?.toString(),
            items: processedItems
        });
    }

    static toEntity(doc?: ICartDoc | null): CartEntity | null {
        if (!doc) return null;

        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }
}