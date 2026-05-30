import {CategoryEntity} from "../../../../../entities/category/CategoryEntity.js";
import {ICategoryDoc} from "../models/Category.js";
import {normalizePersistence} from "../utils.js";

export class CategoryAdapter {
    static toEntity(doc: ICategoryDoc | null): CategoryEntity | null {
        const data = normalizePersistence(doc);
        if (!data) return null;

        const { allowedAttributes, ...rest } = data;

        return new CategoryEntity({
            ...rest,
            allowedAttributes: allowedAttributes || [],
        });
    }
}