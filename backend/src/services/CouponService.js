import Coupon from "../models/Coupon.js";
import {BadRequestError, NotFoundError} from "../errors/apiErrors.js";

export class CouponService {
	async getCoupon(userId) {
		const coupon = await Coupon.findOne({ userId, isActive: true });
		if (!coupon) {
			throw new NotFoundError("Active coupon not found for this user");
		}
		return coupon;
	}

	async validateCoupon(code, userId) {
		const coupon = await Coupon.findOne({ code, userId, isActive: true });
		if (!coupon) {
			throw new NotFoundError("Coupon not found");
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();

			throw new BadRequestError("Coupon expired");
		}

		return {
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage
		};
	}
}