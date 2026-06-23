import {CategoryEntity} from "../../../../../entities/category/CategoryEntity.js";
import {ICategoryDoc} from "../models/Category.js";
import {normalizePersistence} from "../utils.js";

export class CategoryAdapter {
    private static buildEntity(
        data: ReturnType<typeof normalizePersistence<ICategoryDoc>>
    ): CategoryEntity {
        const { allowedAttributes, ...rest } = data;

        return new CategoryEntity({
            ...rest,
            allowedAttributes: allowedAttributes || [],
        });
    }

    static toEntity(doc?: ICategoryDoc | null): CategoryEntity | null {
        if (!doc) return null;

        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }

    static toEntityRequired(doc: ICategoryDoc): CategoryEntity {
        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }
}