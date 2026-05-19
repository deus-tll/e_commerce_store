import {CategoryEntity} from "../../../../../entities/category/CategoryEntity.js";
import {ICategoryDoc} from "../models/Category.js";
import {toPlainObject} from "../utils.js";

export class CategoryAdapter {
    /**
     * Adapts a Mongoose Category Document/object into a domain entity.
     */
    static toEntity(doc: ICategoryDoc | object | null): CategoryEntity | null {
        const data = toPlainObject(doc);
        if (!data) return null;

        const { allowedAttributes, ...rest } = data;

        return new CategoryEntity({
            ...rest,
            allowedAttributes: allowedAttributes || [],
        });
    }
}