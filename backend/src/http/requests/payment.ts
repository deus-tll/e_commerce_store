import {Request} from "express";
import {ClientItemInput} from "../../application/types/payment.js";
import {CustomerDetails} from "../../entities/order/types/CustomerDetails.js";

export interface CheckoutRequest extends Request {
    body: {
        items: ClientItemInput[],
        customerDetails: CustomerDetails,
        couponCode?: string;
    }
}