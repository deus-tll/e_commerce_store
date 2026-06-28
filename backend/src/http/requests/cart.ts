import {Request} from "express";
import {ParamsWithProductIdRequest} from "./shared.js";

export interface CartAddItemRequest extends Request {
    body: {
        productId: string;
    }
}

export interface CartUpdateItemQuantityRequest extends ParamsWithProductIdRequest {
    body: {
        quantity: number;
    }
}