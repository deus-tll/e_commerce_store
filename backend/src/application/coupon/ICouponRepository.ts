import {CouponEntity} from "../../entities/coupon/CouponEntity.js";
import {CouponCreatePersistence} from "../types/coupon.js";

export abstract class ICouponRepository {
	abstract replaceOrCreate(userId: string, data: CouponCreatePersistence): Promise<CouponEntity>;
	abstract updateCouponActiveState(couponCode: string, userId: string, isActive: boolean): Promise<CouponEntity>;
	abstract findByCodeAndUserId(code: string, userId: string): Promise<CouponEntity | null>;
	abstract findActiveByUserId(userId: string): Promise<CouponEntity | null>;
}