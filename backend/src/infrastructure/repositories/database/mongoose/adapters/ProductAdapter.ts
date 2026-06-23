import {UpdateQuery} from "mongoose";

import {IProductDoc} from "../models/Product.js";

import {ProductCreatePersistence, ProductUpdatePersistence} from "../../../../../application/types/product.js";

import {ProductRatingStats} from "../../../../../entities/product/types/ProductRatingStats.js";
import {ProductAttribute} from "../../../../../entities/product/types/ProductAttribute.js";
import {ProductImage} from "../../../../../entities/product/types/ProductImage.js";
import {ProductEntity} from "../../../../../entities/product/ProductEntity.js";

import {toObjectId, normalizePersistence} from "../utils.js";

export type CreateProductDocInput = Omit<IProductDoc, "_id" | "createdAt" | "updatedAt" | "ratingStats">;

export class ProductAdapter {
    private static buildEntity(
        data: ReturnType<typeof normalizePersistence<IProductDoc>>
    ): ProductEntity {
        const { category, images, attributes, ratingStats, ...rest } = data;

        return new ProductEntity({
            ...rest,
            images: new ProductImage(images),
            categoryId: category?.toString(),
            attributes: (attributes || []).map(
                (attr: { name: string; value: string; }) =>
                    new ProductAttribute(attr)),
            ratingStats: new ProductRatingStats(ratingStats)
        });
    }

    static toCreatePersistenceDoc(data: ProductCreatePersistence): CreateProductDocInput {
        const { categoryId, ...rest } = data;

        return {
            ...rest,
            category: toObjectId(categoryId, "Category")
        } as unknown as CreateProductDocInput;
    }

    static toUpdatePersistenceDoc(data: ProductUpdatePersistence): UpdateQuery<IProductDoc> {
        const { categoryId, ...rest } = data;

        return {
            ...rest,
            ...(categoryId && { category: toObjectId(categoryId, "Category") }),
        }
    }

    static toEntity(doc?: IProductDoc | null): ProductEntity | null {
        if (!doc) return null;

        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }

    static toEntityRequired(doc: IProductDoc): ProductEntity {
        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }
}