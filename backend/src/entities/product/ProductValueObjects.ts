export class ProductAttribute {
    public readonly name: string;
    public readonly value: string;

    constructor(data: { name: string, value: string }) {
        this.name = data.name;
        this.value = data.value;

        Object.freeze(this);
    }
}

export class ProductImage {
    public readonly mainImage: string;
    public readonly additionalImages: readonly string[];

    constructor(data: { mainImage: string, additionalImages?: readonly string[] }) {
        this.mainImage = data.mainImage;
        this.additionalImages = Object.freeze([...(data.additionalImages || [])]);

        Object.freeze(this);
    }
}

export class ProductRatingStats {
    public readonly averageRating: number;
    public readonly totalReviews: number;
    public readonly ratingSum: number;

    constructor(data: {
        averageRating?: number;
        totalReviews?: number;
        ratingSum?: number } = {}
    ) {
        this.averageRating = Number(Number(data.averageRating || 0).toFixed(1));
        this.totalReviews = data.totalReviews || 0;
        this.ratingSum = data.ratingSum || 0;

        Object.freeze(this);
    }
}