import {Request} from "express";
import {ProductCreateInput, ProductUpdateInput, ProductFiltersInput} from "../../application/types/product.js";
import {ParamsWithIdRequest} from "./shared.js";

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