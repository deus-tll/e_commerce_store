export class ProductImage {
    public readonly mainImage: string;
    public readonly additionalImages: readonly string[];

    constructor(data: { mainImage: string, additionalImages?: readonly string[] }) {
        this.mainImage = data.mainImage;
        this.additionalImages = Object.freeze([...(data.additionalImages || [])]);

        Object.freeze(this);
    }
}