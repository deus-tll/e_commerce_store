import {IOrderDoc} from "../models/Order.js";
import {OrderEntity} from "../../../../../entities/order/OrderEntity.js";
import {OrderProductItem} from "../../../../../entities/order/types/OrderProductItem.js";
import {normalizePersistence} from "../utils.js";

export class OrderAdapter {
    private static buildEntity(
        data: ReturnType<typeof normalizePersistence<IOrderDoc>>
    ): OrderEntity {
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

    static toEntity(doc?: IOrderDoc | null): OrderEntity | null {
        if (!doc) return null;

        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }

    static toEntityRequired(doc: IOrderDoc): OrderEntity {
        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }
}