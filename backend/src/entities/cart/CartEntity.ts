import {CartItem} from "./types/CartItem.js";

export class CartEntity {
    public readonly id: string;
    public readonly userId: string;
    public readonly items: readonly CartItem[];
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: {
        id: string;
        userId: string;
        items: readonly CartItem[];
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = data.id;
        this.userId = data.userId;
        this.items = Object.freeze([...data.items]);
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        Object.freeze(this);
    }
}