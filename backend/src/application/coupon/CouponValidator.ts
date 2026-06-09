import {ICouponRepository} from "./ICouponRepository.js";

import {CouponEntity} from "../../entities/coupon/CouponEntity.js";
import {CouponValidationDTO} from "../types/coupon.js";

import {DomainValidationError, EntityNotFoundError} from "../../errors/index.js";

import {ValidationErrorType} from "../../enums/error.js";

export class CouponValidator {
	constructor(
		private readonly couponRepository: ICouponRepository
	) {}

	private async handleExpiredCoupon(entity: CouponEntity, userId: string): Promise<void> {
		if (entity.isExpired()) {
			await this.couponRepository.updateCouponActiveState(entity.code, userId, false);
			throw new DomainValidationError("Coupon expired", ValidationErrorType.EXPIRED);
		}
	}

	async validate(code: string, userId: string): Promise<CouponValidationDTO> {
		const entity = await this.couponRepository.findByCodeAndUserId(code, userId);

		if (!entity) throw new EntityNotFoundError("Coupon", { code, userId });

		await this.handleExpiredCoupon(entity, userId);

		if (!entity.isActive) throw new DomainValidationError("Coupon is not active");

		return new CouponValidationDTO({
			message: "Coupon is valid",
			code: entity.code,
			discountPercentage: entity.discountPercentage,
		});
	}
}