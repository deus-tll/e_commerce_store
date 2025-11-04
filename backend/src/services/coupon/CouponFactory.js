import {ICouponFactory} from "../../interfaces/coupon/ICouponFactory.js";
import {CreateCouponDTO} from "../../domain/index.js";
import {MS_PER_DAY} from "../../utils/timeConstants.js";

const COUPON_DISCOUNT_PERCENTAGE = process.env.COUPON_DISCOUNT_PERCENTAGE || 10;

/**
 * @augments ICouponFactory
 * @description Concrete implementation of ICouponFactory.
 */
export class CouponFactory extends ICouponFactory {
	#generateCode() {
		return "GIFT" + Math.random().toString(36).substring(2, 12).toUpperCase();
	}

	#getExpirationDate() {
		return new Date(Date.now() + 30 * MS_PER_DAY);
	}

	createDTO(userId) {
		return new CreateCouponDTO({
			code: this.#generateCode(),
			discountPercentage: COUPON_DISCOUNT_PERCENTAGE,
			expirationDate: this.#getExpirationDate(),
			userId: userId,
			isActive: true,
		});
	}
}