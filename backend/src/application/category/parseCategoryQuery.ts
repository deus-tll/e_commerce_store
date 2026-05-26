import {CategoryFiltersInput, CategoryQueryPersistence} from "../types/category.types.js";

export function parseCategoryQuery(filters: CategoryFiltersInput): CategoryQueryPersistence {
    const { search } = filters;

    return Object.freeze({
        ...(search && { search }),
    });
}