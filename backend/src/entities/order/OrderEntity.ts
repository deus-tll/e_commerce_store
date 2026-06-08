import {OrderProductItem} from "./types/OrderProductItem.js";
import {CustomerDetails} from "./types/CustomerDetails.js";
import {OrderStatus} from "../../enums/application.js";

export class OrderEntity {
    public readonly id: string;
    public readonly userId: string;
    public readonly products: readonly OrderProductItem[];
    public readonly customerDetails: CustomerDetails;
    public readonly totalAmount: number;
    public readonly status: OrderStatus;
    public readonly paymentSessionId?: string;
    public readonly orderNumber: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: {
        id: string;
        userId: string;
        products: readonly OrderProductItem[];
        customerDetails: CustomerDetails;
        totalAmount: number;
        status: OrderStatus;
        paymentSessionId?: string;
        orderNumber: string;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = data.id;
        this.userId = data.userId;
        this.products = Object.freeze([...data.products]);
        this.customerDetails = data.customerDetails;
        this.totalAmount = data.totalAmount;
        this.status = data.status;
        this.paymentSessionId = data.paymentSessionId;
        this.orderNumber = data.orderNumber;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        Object.freeze(this);
    }
}