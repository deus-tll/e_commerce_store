import {CouponService} from "../services/CouponService.js";

export class CouponController {
	constructor() {
		this.couponService = new CouponService();
	}

	getCoupon = async (req, res, next) => {
		try {
			const userId = req.user._id;
			const coupon = await this.couponService.getCoupon(userId);

			res.status(200).json(coupon);
		}
		catch (error) {
			next(error);
		}
	}

	validateCoupon = async (req, res, next) => {
		try {
			const { code } = req.body;
			const userId = req.user._id;

			const validationResult = await this.couponService.validateCoupon(code, userId);

			res.status(200).json(validationResult);
		}
		catch (error) {
			next(error);
		}
	}
}