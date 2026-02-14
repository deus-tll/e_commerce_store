import {ICouponFactory} from "../../interfaces/coupon/ICouponFactory.js";
import {CreateCouponDTO} from "../../domain/index.js";

import {MS_PER_DAY} from "../../constants/time.js";

/**
 * @augments ICouponFactory
 * @description Concrete implementation of ICouponFactory.
 */
export class CouponFactory extends ICouponFactory {
	#discountPercentage;

	constructor(discountPercentage) {
		super();
		this.#discountPercentage = discountPercentage || 10;
	}

	#generateCode() {
		return "GIFT" + Math.random().toString(36).substring(2, 12).toUpperCase().trim();
	}

	#getExpirationDate() {
		return new Date(Date.now() + 30 * MS_PER_DAY);
	}

	create(userId) {
		return new CreateCouponDTO({
			code: this.#generateCode(),
			discountPercentage: this.#discountPercentage,
			expirationDate: this.#getExpirationDate(),
			userId: userId,
			isActive: true,
		});
	}
}