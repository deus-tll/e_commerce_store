export class ProductAttribute {
    public readonly name: string;
    public readonly value: string;

    constructor(data: { name: string, value: string }) {
        this.name = data.name;
        this.value = data.value;

        Object.freeze(this);
    }
}