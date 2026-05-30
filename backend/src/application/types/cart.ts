import {CartEntity} from "../../entities/cart/CartEntity.js";
import {ShortProductDTO} from "./product.js";

export class CartItemDTO {
    public readonly product: ShortProductDTO;
    public readonly quantity: number;

    constructor(data: { product: ShortProductDTO, quantity: number }) {
        this.product = data.product;
        this.quantity = data.quantity;

        Object.freeze(this);
    }
}

export class CartDTO {
    public readonly id: string;
    public readonly userId: string;
    public readonly items: readonly CartItemDTO[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(entity: CartEntity, items: CartItemDTO[]) {
        this.id = entity.id;
        this.userId = entity.userId;
        this.items = Object.freeze([...items]);
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;

        Object.freeze(this);
    }
}