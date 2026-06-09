import {Request} from "express";

export interface ParamsWithIdRequest extends Request {
    params: { id: string };
}

export interface ParamsWithSlugRequest extends Request {
    params: { slug: string };
}

export interface ParamsWithProductIdRequest extends Request {
    params: {
        productId: string;
    }
}

export interface BodyWithCodeRequest extends Request {
    body: {
        code: string;
    }
}