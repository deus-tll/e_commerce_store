import {Request} from "express";
import {UserCreateInput, UserFiltersInput, UserUpdateInput} from "../../application/types/user.js";
import {ParamsWithIdRequest} from "./shared.js";

export interface UserCreateRequest extends Request {
    body: UserCreateInput;
}

export interface UserUpdateRequest extends ParamsWithIdRequest {
    body: UserUpdateInput;
}

export interface UserGetAllQuery extends UserFiltersInput {
    page: number;
    limit: number;
}