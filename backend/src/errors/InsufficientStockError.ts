import {DomainError} from "./DomainError.js";

export class InsufficientStockError extends DomainError {
    constructor(message = "Not enough stock for one or more items in the order.") {
        super(message);
    }
}