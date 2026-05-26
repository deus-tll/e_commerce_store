import {Request} from "express";
import {CategoryFiltersInput, CategoryCreateInput, CategoryUpdateInput} from "../../application/types/category.types.js";
import {ParamsWithIdRequest} from "./shared.request.types.js";

export interface CategoryCreateRequest extends Request {
    body: CategoryCreateInput;
}

export interface CategoryUpdateRequest extends ParamsWithIdRequest {
    body: CategoryUpdateInput;
}

export interface CategoryGetAllQuery extends CategoryFiltersInput {
    page: number;
    limit: number;
}