export class OrderProductItem {
    public readonly id: string;
    public readonly quantity: number;
    public readonly price: number;
    public readonly name: string;
    public readonly image: string;

    constructor(data: {
        id: string;
        quantity: number;
        price: number;
        name: string;
        image: string;
    }) {
        this.id = data.id;
        this.quantity = data.quantity;
        this.price = data.price;
        this.name = data.name;
        this.image = data.image;

        Object.freeze(this);
    }
}