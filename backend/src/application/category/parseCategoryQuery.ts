import {CategoryFiltersInput, CategoryQueryPersistence} from "../types/category.js";

export function parseCategoryQuery(filters: CategoryFiltersInput): CategoryQueryPersistence {
    const { search } = filters;

    return Object.freeze({
        ...(search && { search }),
    });
}