import {CategoryEntity} from "../../entities/category/CategoryEntity.js";
import {PaginationMetadata} from "./shared.js";

// INPUT DATA STRUCTURES
//=======================

export interface CategoryCreateInput {
    name: string;
    image: string;
    allowedAttributes: string[];
}

export type CategoryUpdateInput = Partial<
    CategoryCreateInput &
    { slug?: string }
>;

export interface CategoryFiltersInput {
    search?: string;
}

export type CategoryCreatePersistence =
    CategoryCreateInput &
    { slug: string };

export type CategoryUpdatePersistence = Partial<CategoryCreatePersistence>;

export type CategoryQueryPersistence = CategoryFiltersInput;

// OUTPUT DATA STRUCTURES
//=======================

export class CategoryDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly slug: string;
    public readonly image: string;
    public readonly allowedAttributes: readonly string[];

    constructor(entity: CategoryEntity) {
        this.id = entity.id;
        this.name = entity.name;
        this.slug = entity.slug;
        this.image = entity.image;
        this.allowedAttributes = Object.freeze([...entity.allowedAttributes]);

        Object.freeze(this);
    }
}

export class CategoryPaginationResultDTO {
    public readonly categories: readonly CategoryDTO[];
    public readonly pagination: PaginationMetadata;

    constructor(categories: CategoryDTO[], pagination: PaginationMetadata) {
        this.categories = Object.freeze([...categories]);
        this.pagination = pagination;

        Object.freeze(this);
    }
}