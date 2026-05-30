import {UpdateQuery} from "mongoose";

import {IProductDoc} from "../models/Product.js";
import {ProductCreatePersistence, ProductUpdatePersistence} from "../../../../../application/types/product.js";
import {ProductAttribute, ProductImage, ProductRatingStats} from "../../../../../entities/product/ProductValueObjects.js";
import {ProductEntity} from "../../../../../entities/product/ProductEntity.js";

import {toObjectId, normalizePersistence} from "../utils.js";

export type CreateProductDocInput = Omit<IProductDoc, "_id" | "createdAt" | "updatedAt" | "ratingStats">;

export class ProductAdapter {
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

    static toEntity(doc: IProductDoc | null): ProductEntity | null {
        const data = normalizePersistence(doc);
        if (!data) return null;

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
}