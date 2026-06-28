/**
 * An item data that is being sent by user during checkout
 */
export interface ClientItemInput {
    id: string;
    quantity: number;
}

/**
 * The data to pass into payment session
 */
export class PaymentMetadataDTO {
    public readonly orderId: string;
    public readonly userId: string;

    constructor(orderId: string, userId: string) {
        this.orderId = orderId;
        this.userId = userId;

        Object.freeze(this);
    }
}

/**
 * Result of a Payment Provider's checkout session creation.
 */
export class CheckoutSessionDTO {
    public readonly id: string;
    public readonly totalAmount: number;

    constructor(id: string, totalAmount: number) {
        this.id = id;
        this.totalAmount = totalAmount;

        Object.freeze(this);
    }
}

/**
 * The data of an event from payment webhook completion.
 */
export class PaymentEventDataDTO {
    public readonly orderId: string;
    public readonly userId: string;
    public readonly couponCode: string;
    public readonly totalAmountInCents: number;

    constructor(data: {
        orderId: string;
        userId: string;
        couponCode: string;
        totalAmountInCents: number;
    }) {
        this.orderId = data.orderId;
        this.userId = data.userId;
        this.couponCode = data.couponCode;
        this.totalAmountInCents = data.totalAmountInCents;

        Object.freeze(this);
    }
}

/**
 * Successfully processed webhook's payment event object
 */
export class WebhookPaymentEventDTO {
    public readonly type: string;
    public readonly data: PaymentEventDataDTO;

    constructor(type: string, data: PaymentEventDataDTO) {
        this.type = type;
        this.data = data;

        Object.freeze(this);
    }
}