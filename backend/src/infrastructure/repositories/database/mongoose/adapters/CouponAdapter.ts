import {ICouponDoc} from "../models/Coupon.js";
import {CouponEntity} from "../../../../../entities/coupon/CouponEntity.js";
import {normalizePersistence} from "../utils.js";

export class CouponAdapter {
    private static buildEntity(
        data: ReturnType<typeof normalizePersistence<ICouponDoc>>
    ): CouponEntity {
        const { expirationDate, user, ...rest } = data;

        return new CouponEntity({
            ...rest,
            expirationDate: expirationDate instanceof Date ? expirationDate : new Date(expirationDate),
            userId: user?.toString()
        });
    }

    static toEntity(doc?: ICouponDoc | null): CouponEntity | null {
        if (!doc) return null;

        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }

    static toEntityRequired(doc: ICouponDoc): CouponEntity {
        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }
}