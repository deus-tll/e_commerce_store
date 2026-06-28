import {CouponEntity} from "../../entities/coupon/CouponEntity.js";

export type CouponCreatePersistence = Pick<CouponEntity, "code" | "discountPercentage" | "expirationDate" | "isActive">;

export class CouponDTO {
    public readonly id: string;
    public readonly userId: string;
    public readonly code: string;
    public readonly discountPercentage: number;
    public readonly expirationDate: Date;
    public readonly isActive: boolean;

    constructor(entity: CouponEntity) {
        this.id = entity.id;
        this.code = entity.code;
        this.discountPercentage = entity.discountPercentage;
        this.expirationDate = entity.expirationDate;
        this.isActive = entity.isActive;
        this.userId = entity.userId;

        Object.freeze(this);
    }
}

export class CouponValidationDTO {
    public readonly message: string;
    public readonly code: string;
    public readonly discountPercentage: number;

    constructor(data: {
        message: string;
        code: string;
        discountPercentage: number;
    }) {
        this.message = data.message;
        this.code = data.code;
        this.discountPercentage = data.discountPercentage;

        Object.freeze(this);
    }
}