import {MS_PER_DAY} from "../../constants/time.js";

export class CouponEntity {
    public readonly id: string;
    public readonly userId: string;
    public readonly code: string;
    public readonly discountPercentage: number;
    public readonly expirationDate: Date;
    public readonly isActive: boolean;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: {
        id: string;
        code: string;
        discountPercentage: number;
        expirationDate: Date;
        isActive: boolean;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = data.id;
        this.userId = data.userId;
        this.code = data.code;
        this.discountPercentage = data.discountPercentage;
        this.expirationDate = data.expirationDate;
        this.isActive = !!data.isActive;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        Object.freeze(this);
    }

    isExpired(): boolean {
        return this.expirationDate < new Date();
    }

    static prepareCreatePersistence(
        discountPercentage: number
    ): Pick<CouponEntity, "code" | "discountPercentage" | "expirationDate" | "isActive"> {
        const code = "GIFT" + Math.random().toString(36).substring(2, 12).toUpperCase().trim();
        const expirationDate = new Date(Date.now() + 30 * MS_PER_DAY);

        return {
            code,
            discountPercentage: discountPercentage || 10,
            expirationDate: expirationDate,
            isActive: true
        };
    }
}