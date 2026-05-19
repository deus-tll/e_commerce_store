import {ICouponValidator} from "../../interfaces/coupon/ICouponValidator.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {ICouponRepository} from "./ICouponRepository.js";
import {CouponValidationDTO} from "../../domain/index.js";

import {DomainValidationError, EntityNotFoundError} from "../../errors/index.ts";

import {ValidationErrorTypes} from "../../constants/errors.js";

/**
 * @augments ICouponValidator
 * @description Concrete implementation of ICouponValidator.
 */
export class CouponValidator extends ICouponValidator {

	/** @type {ICouponRepository} */ #couponRepository;

	/**
	 * @param {ICouponRepository} couponRepository
	 */
	constructor(couponRepository) {
		super();
		this.#couponRepository = couponRepository;
	}

	async #handleExpiredCoupon(couponEntity, userId) {
		if (couponEntity.isExpired()) {
			await this.#couponRepository.updateCouponActiveState(couponEntity.code, userId, false);
			throw new DomainValidationError("Coupon expired", ValidationErrorTypes.EXPIRED);
		}
	}

	async validate(code, userId) {
		const couponEntity = await this.#couponRepository.findByCodeAndUserId(code, userId);

		if (!couponEntity) throw new EntityNotFoundError("Coupon", { code, userId });

		await this.#handleExpiredCoupon(couponEntity, userId);

		if (!couponEntity.isActive) throw new DomainValidationError("Coupon is not active");

		return new CouponValidationDTO({
			message: "Coupon is valid",
			code: couponEntity.code,
			discountPercentage: couponEntity.discountPercentage,
		});
	}
}