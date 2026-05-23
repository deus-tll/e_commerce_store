import {ProductAttribute, ProductImage, ProductRatingStats} from "../../entities/product/ProductValueObjects.js";
import {ProductEntity} from "../../entities/product/ProductEntity.js";
import {CategoryDTO} from "./category.dto.js";
import {PaginationMetadata} from "./shared.dto.js";

export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    stock: number;
    images: ProductImage;
    categoryId: string;
    attributes: ProductAttribute[];
    isFeatured: boolean;
}

export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    images?: Partial<ProductImage>;
    categoryId?: string;
    attributes?: ProductAttribute[];
    isFeatured?: boolean;
}

export interface ProductFiltersInput {
    categorySlug?: string;
    search?: string;
    attributes?: Record<string, string | string[]>;
    sortBy?: 'price' | 'createdAt' | 'name' | 'ratingStats.averageRating';
    order?: 'asc' | 'desc';
}

export interface ProductParserContext {
    categoryId: string | null;
}

export type CreateProductPersistence = Pick<
    ProductEntity,
    "name" | "description" | "price" |
    "stock" | "images" | "categoryId" |
    "attributes" | "isFeatured"
>;
export type UpdateProductPersistence = Partial<CreateProductPersistence>;

export interface ProductPersistenceQuery {
    categoryId?: string;
    search?: string;
    attributes?: Record<string, string | string[]>;
}

export class ProductDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly price: number;
    public readonly stock: number;
    public readonly images: ProductImage;
    public readonly category: CategoryDTO;
    public readonly attributes: readonly ProductAttribute[];
    public readonly isFeatured: boolean;
    public readonly ratingStats: ProductRatingStats;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(entity: ProductEntity, categoryDTO: CategoryDTO) {
        this.id = entity.id;
        this.name = entity.name;
        this.description = entity.description;
        this.price = entity.price;
        this.stock = entity.stock;
        this.images = entity.images;
        this.category = categoryDTO;
        this.attributes = Object.freeze([...entity.attributes]);
        this.isFeatured = entity.isFeatured;
        this.ratingStats = entity.ratingStats;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;

        Object.freeze(this);
    }
}

export class ShortProductDTO {
    public readonly id: string;
    public readonly categoryId: string;
    public readonly name: string;
    public readonly price: number;
    public readonly stock: number;
    public readonly image: string;

    constructor(entity: ProductEntity) {
        this.id = entity.id;
        this.categoryId = entity.categoryId;
        this.name = entity.name;
        this.price = entity.price;
        this.stock = entity.stock;
        this.image = entity.images?.mainImage || "";

        Object.freeze(this);
    }
}

export class ProductPaginationResultDTO {
    public readonly products: readonly ProductDTO[];
    public readonly pagination: PaginationMetadata;

    constructor(products: ProductDTO[], pagination: PaginationMetadata) {
        this.products = Object.freeze([...products]);
        this.pagination = pagination;

        Object.freeze(this);
    }
}

export class AttributeFacetDTO {
    public readonly name: string;
    public readonly values: readonly string[];

    constructor(name: string, values: string[]) {
        this.name = name;
        this.values = Object.freeze([...values]);

        Object.freeze(this);
    }
}