import {ParamsWithIdRequest} from "./shared.js";
import {ReviewCreateInput, ReviewUpdateInput} from "../../application/types/review.js";

export interface ReviewCreateRequest extends ParamsWithIdRequest {
    body: ReviewCreateInput;
}

export interface ReviewUpdateRequest extends ParamsWithIdRequest {
    body: ReviewUpdateInput;
}

export interface ReviewGetAllByProductQuery {
    page: number;
    limit: number;
}