import {Request} from "express";
import {ParamsWithIdRequest} from "./shared.js";
import {OrderStatus} from "../../enums/application.js";
import {OrderFiltersInput} from "../../application/types/order.js";

export interface OrderUpdateStatusRequest extends ParamsWithIdRequest {
    body: {
        status: OrderStatus;
    }
}

export interface ParamsWithOrderNumberRequest extends Request {
    params: {
        orderNumber: string;
    }
}

export interface ParamsWithSessionIdRequest extends Request {
    params: {
        sessionId: string;
    }
}

export interface OrderGetAllQuery extends OrderFiltersInput {
    page: number;
    limit: number;
}

export type OrderGetAllMineQuery = Omit<OrderGetAllQuery, "userId">