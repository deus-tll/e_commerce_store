import {Request} from "express";
import {ProductCreateInput, ProductUpdateInput, ProductFiltersInput} from "../../application/types/product.types.js";
import {ParamsWithIdRequest} from "./shared.request.types.js";

export interface ProductCreateRequest extends Request {
    body: ProductCreateInput;
}

export interface ProductUpdateRequest extends ParamsWithIdRequest {
    body: ProductUpdateInput;
}

export interface ProductGetAllQuery extends ProductFiltersInput {
    page: number;
    limit: number;
}