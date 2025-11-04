import {ICouponValidator} from "../../interfaces/coupon/ICouponValidator.js";
import {IUserService} from "../../interfaces/user/IUserService.js";
import {ICouponRepository} from "../../interfaces/repositories/ICouponRepository.js";
import {CouponValidationDTO, UpdateCouponDTO} from "../../domain/index.js";

import {BadRequestError, NotFoundError} from "../../errors/apiErrors.js";

/**
 * @augments ICouponValidator
 * @description Concrete implementation of ICouponValidator.
 */
export class CouponValidator extends ICouponValidator {
	/** @type {IUserService} */ #userService;
	/** @type {ICouponRepository} */ #couponRepository;

	/**
	 * @param {IUserService} userService
	 * @param {ICouponRepository} couponRepository
	 */
	constructor(userService, couponRepository) {
		super();
		this.#userService = userService;
		this.#couponRepository = couponRepository;
	}

	async #handleExpiredCoupon(couponEntity, userId) {
		if (couponEntity.isExpired()) {
			const updateDTO = new UpdateCouponDTO({
				code: couponEntity.code,
				userId,
				isActive: false
			});
			await this.#couponRepository.updateByCodeAndUserId(updateDTO);

			throw new BadRequestError("Coupon expired");
		}
	}

	async validateUserExists(userId) {
		await this.#userService.getByIdOrFail(userId);
	}

	async validate(code, userId) {
		const couponEntity = await this.#couponRepository.findByCodeAndUserId(code, userId);

		if (!couponEntity) {
			throw new NotFoundError("Coupon not found");
		}

		await this.#handleExpiredCoupon(couponEntity, userId);

		if (!couponEntity.isActive) {
			throw new BadRequestError("Coupon is not active");
		}

		return new CouponValidationDTO({
			message: "Coupon is valid",
			code: couponEntity.code,
			discountPercentage: couponEntity.discountPercentage,
		});
	}
}