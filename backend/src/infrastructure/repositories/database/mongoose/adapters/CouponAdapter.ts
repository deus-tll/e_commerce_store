import {ICouponDoc} from "../models/Coupon.js";
import {CouponEntity} from "../../../../../entities/coupon/CouponEntity.js";
import {normalizePersistence} from "../utils.js";

export class CouponAdapter {
    static toEntity(doc?: ICouponDoc): CouponEntity | null {
        const data = normalizePersistence(doc);
        if (!data) return null;

        const { expirationDate, user, ...rest } = data;

        return new CouponEntity({
            ...rest,
            expirationDate: expirationDate instanceof Date ? expirationDate : new Date(expirationDate),
            userId: user?.toString()
        });
    }
}