import Coupon from "../models/mongoose/Coupon.js";
import {BadRequestError, NotFoundError} from "../errors/apiErrors.js";
import {MS_PER_DAY} from "../utils/timeConstants.js";

export class CouponService {
	async createNewGiftCoupon(userId) {
		await Coupon.findOneAndDelete({ userId });

		const newCouponData = {
			code: "GIFT" + Math.random().toString(36).substr(2, 10).toUpperCase(),
			discountPercentage: 10,
			expirationDate: new Date(Date.now() + 30 * MS_PER_DAY),
			userId: userId,
		};

		return Coupon.create(newCouponData);
	}

	async getActiveCouponByUserId(userId) {
		const coupon = await Coupon.findOne({ userId, isActive: true });
		if (!coupon) {
			throw new NotFoundError("Active coupon not found for this user");
		}
		return coupon;
	}

	async findActiveCouponByCodeAndUser(code, userId) {
		return Coupon.findOne({ code, userId, isActive: true });
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

	async deactivateCoupon(code, userId) {
		await Coupon.findOneAndUpdate(
			{
				code: code,
				userId: userId
			},
			{
				isActive: false,
			}
		);
	}
}