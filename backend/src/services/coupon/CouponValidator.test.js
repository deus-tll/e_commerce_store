import { describe, it, expect, beforeEach } from "vitest";

import {CouponValidator} from "./CouponValidator.js";
import {ICouponRepository} from "../../interfaces/repositories/ICouponRepository.js";
import {CouponEntity} from "../../domain/index.js";
import {EntityNotFoundError} from "../../errors/index.js";

import {createMockFromInterface} from "../../tests/utils/mockFactory.js";

describe("CouponValidator", () => {
    let mockCouponRepository;
    let couponValidator;

    const USER_ID = "user-123";
    const COUPON_CODE = "some-coupon-code";

    beforeEach(() => {
        mockCouponRepository = createMockFromInterface(ICouponRepository);
        couponValidator = new CouponValidator(mockCouponRepository);
    });

    it("should return Validation DTO if coupon is valid, active and not expired", async () => {
        const validCoupon = new CouponEntity({
            code: COUPON_CODE,
            discountPercentage: 20,
            expirationDate: new Date(Date.now() + 10000),
            isActive: true,
            userId: USER_ID
        });

        mockCouponRepository.findByCodeAndUserId.mockResolvedValue(validCoupon);

        const result = await couponValidator.validate(COUPON_CODE, USER_ID);

        expect(result.code).toBe(COUPON_CODE);
        expect(result.discountPercentage).toBe(20);
        expect(result.message).toBe("Coupon is valid");
    });

    it("should throw EntityNotFoundError if coupon does not exist", async () => {
        mockCouponRepository.findByCodeAndUserId.mockResolvedValue(null);

        await expect(couponValidator.validate(COUPON_CODE, USER_ID))
            .rejects
            .toThrow(EntityNotFoundError);
    });

    it("should deactivate coupon and throw DomainValidationError if expired", async () => {
        const expiredCoupon = new CouponEntity({
            code: COUPON_CODE,
            expirationDate: new Date(Date.now() - 10000),
            isActive: true,
            userId: USER_ID
        });

        mockCouponRepository.findByCodeAndUserId.mockResolvedValue(expiredCoupon);

        await expect(couponValidator.validate(COUPON_CODE, USER_ID))
            .rejects
            .toThrow("Coupon expired");

        expect(mockCouponRepository.updateCouponActiveState)
            .toHaveBeenCalledWith(COUPON_CODE, USER_ID, false);
    });

    it("should throw DomainValidationError if coupon is manually deactivated", async () => {
        const inactiveCoupon = new CouponEntity({
            code: COUPON_CODE,
            expirationDate: new Date(Date.now() + 10000),
            isActive: false,
            userId: USER_ID
        });

        mockCouponRepository.findByCodeAndUserId.mockResolvedValue(inactiveCoupon);

        await expect(couponValidator.validate(COUPON_CODE, USER_ID))
            .rejects
            .toThrow("Coupon is not active");
    });
});