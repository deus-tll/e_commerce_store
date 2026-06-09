import {CouponEntity} from "../../entities/coupon/CouponEntity.js";
import {CouponDTO} from "../types/coupon.js";

export class CouponMapper {
	static toDTO(entity: CouponEntity): CouponDTO {
		return new CouponDTO(entity);
	}
}