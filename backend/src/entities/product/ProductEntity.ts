import {ProductAttribute, ProductImage, ProductRatingStats} from "./ProductValueObjects.js";

export class ProductEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly price: number;
    public readonly stock: number;
    public readonly images: ProductImage;
    public readonly categoryId: string;
    public readonly attributes: readonly ProductAttribute[];
    public readonly isFeatured: boolean;
    public readonly ratingStats: ProductRatingStats;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: {
        id: string; name: string; description: string; price: number; stock: number;
        images: ProductImage; categoryId: string; attributes: readonly ProductAttribute[];
        isFeatured: boolean; ratingStats: ProductRatingStats; createdAt: Date; updatedAt: Date;
    }) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.stock = data.stock;
        this.images = data.images;
        this.categoryId = data.categoryId;
        this.attributes = Object.freeze([...data.attributes]);
        this.isFeatured = data.isFeatured;
        this.ratingStats = data.ratingStats;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        Object.freeze(this);
    }
}