import {IOrderDoc} from "../models/Order.js";
import {OrderEntity} from "../../../../../entities/order/OrderEntity.js";
import {normalizePersistence} from "../utils.js";
import {OrderProductItem} from "../../../../../entities/order/types/OrderProductItem.js";

export class OrderAdapter {
    static toEntity(doc?: IOrderDoc): OrderEntity | null {
        const data = normalizePersistence(doc);
        if (!data) return null;

        const { products, user, ...rest } = data;

        const orderItems = products.map(item => new OrderProductItem({
            id: item.product?.toString(),
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image
        }));

        return new OrderEntity({
            ...rest,
            userId: user?.toString(),
            products: orderItems
        });
    }
}