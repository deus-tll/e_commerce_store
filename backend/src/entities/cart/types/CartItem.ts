export class CartItem {
    public readonly productId: string;
    public readonly quantity: number;

    constructor(data: { productId: string, quantity: number }) {
        this.productId = data.productId;
        this.quantity = data.quantity;

        Object.freeze(this);
    }
}