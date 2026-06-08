import {OrderProductItem} from "../../entities/order/types/OrderProductItem.js";
import {CustomerDetails} from "../../entities/order/types/CustomerDetails.js";
import {OrderEntity} from "../../entities/order/OrderEntity.js";
import {ShortUserDTO} from "./user.js";
import {OrderStatus} from "../../enums/application.js";
import {PaginationMetadata} from "./shared.js";

// INPUT DATA STRUCTURES
//=======================

export interface OrderCreateInput {
    products: OrderProductItem[];
    customerDetails: CustomerDetails;
    totalAmount: number;
    paymentSessionId?: string;
}

export interface OrderFiltersInput {
    status?: OrderStatus;
    userId?: string;
    sortBy?: "createdAt" | "totalAmount";
    order?: "asc" | "desc";
}

export type OrderFiltersPersistence = OrderFiltersInput;

export type OrderCreatePersistence = OrderCreateInput;

// OUTPUT DATA STRUCTURES
//=======================

export class OrderDTO {
    public readonly id: string;
    public readonly user: ShortUserDTO;
    public readonly products: readonly OrderProductItem[];
    public readonly customerDetails: CustomerDetails;
    public readonly totalAmount: number;
    public readonly status: OrderStatus;
    public readonly paymentSessionId?: string;
    public readonly orderNumber: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(entity: OrderEntity, userShortDTO: ShortUserDTO) {
        this.id = entity.id;
        this.user = userShortDTO;
        this.products = Object.freeze([...entity.products]);
        this.customerDetails = entity.customerDetails;
        this.totalAmount = entity.totalAmount;
        this.status = entity.status;
        this.paymentSessionId = entity.paymentSessionId;
        this.orderNumber = entity.orderNumber;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;

        Object.freeze(this);
    }
}

export class OrderPaginationResultDTO {
    public readonly orders: readonly OrderDTO[];
    public readonly pagination: PaginationMetadata;

    constructor(orders: OrderDTO[], pagination: PaginationMetadata) {
        this.orders = Object.freeze([...orders]);
        this.pagination = pagination;

        Object.freeze(this);
    }
}

export class SalesSummaryDTO {
    public readonly totalSales: number;
    public readonly totalRevenue: number;

    constructor(totalSales: number, totalRevenue: number) {
        this.totalSales = totalSales;
        this.totalRevenue = totalRevenue;

        Object.freeze(this);
    }
}

export class DailySalesSummaryDTO {
    public readonly date: string;
    public readonly salesCount: number;
    public readonly totalRevenue: number;

    constructor(data: {
        date: string;
        salesCount: number;
        totalRevenue: number;
    }) {
        this.date = data.date;
        this.salesCount = data.salesCount;
        this.totalRevenue = data.totalRevenue;

        Object.freeze(this);
    }
}