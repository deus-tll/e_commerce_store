import {Request} from "express";
import {CreateCategoryDTO, UpdateCategoryDTO} from "../../application/dtos/category.dto.js";

export interface CreateRequest extends Request {
    body: CreateCategoryDTO;
}

export interface UpdateRequest extends Request {
    params: { id: string };
    body: UpdateCategoryDTO;
}

export interface DeleteRequest extends Request {
    params: { id: string };
}

export interface GetAllRequest extends Request {
    query: {
        page: number;
        limit: number;
        search?: string;
        [key: string]: any;
    };
}

export interface GetBySlugRequest extends Request {
    params: { slug: string };
}