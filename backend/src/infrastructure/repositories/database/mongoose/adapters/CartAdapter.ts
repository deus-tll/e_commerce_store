import {CartEntity} from "../../../../../entities/cart/CartEntity.js";
import {CartItem} from "../../../../../entities/cart/types/CartItem.js";
import {ICartDoc} from "../models/Cart.js";

import {normalizePersistence} from "../utils.js";

export class CartAdapter {
    static toEntity(doc?: ICartDoc): CartEntity | null {
        const data = normalizePersistence(doc);
        if (!data) return null;

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
}