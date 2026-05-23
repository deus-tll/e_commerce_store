import {Request} from "express";
import {CreateProductDTO, UpdateProductDTO, ProductFiltersInput} from "../../application/dtos/product.dto.js";
import {ParamsWithIdRequest} from "./sharedRequests.js";

export interface CreateRequest extends Request {
    body: CreateProductDTO;
}

export interface UpdateRequest extends ParamsWithIdRequest {
    body: UpdateProductDTO;
}

export interface GetAllProductsQuery extends ProductFiltersInput {
    page: number;
    limit: number;
}