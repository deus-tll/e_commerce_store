import {describe, it, expect, beforeEach, Mocked} from "vitest";

import {CouponValidator} from "../CouponValidator.js";
import {ICouponRepository} from "../ICouponRepository.js";
import {CouponEntity} from "../../../entities/coupon/CouponEntity.js";

import {EntityNotFoundError} from "../../../errors/index.js";

import {createMock} from "../../../tests/utils/createMock.js";

describe("CouponValidator", () => {
    let mockCouponRepository: Mocked<ICouponRepository>;
    let couponValidator: CouponValidator;

    const COUPON_ID = "coupon-id";
    const USER_ID = "user-123";
    const COUPON_CODE = "some-coupon-code";
    const DISCOUNT_PERCENTAGE = 20;

    beforeEach(() => {
        mockCouponRepository = createMock<ICouponRepository>();
        couponValidator = new CouponValidator(mockCouponRepository);
    });

    it("should return Validation DTO if coupon is valid, active and not expired", async () => {
        const validCoupon = new CouponEntity({
            id: COUPON_ID,
            code: COUPON_CODE,
            discountPercentage: DISCOUNT_PERCENTAGE,
            expirationDate: new Date(Date.now() + 10000),
            isActive: true,
            userId: USER_ID,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        mockCouponRepository.findByCodeAndUserId.mockResolvedValue(validCoupon);

        const result = await couponValidator.validate(COUPON_CODE, USER_ID);

        expect(result.code).toBe(COUPON_CODE);
        expect(result.discountPercentage).toBe(DISCOUNT_PERCENTAGE);
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
            id: COUPON_ID,
            code: COUPON_CODE,
            discountPercentage: DISCOUNT_PERCENTAGE,
            expirationDate: new Date(Date.now() - 10000),
            isActive: true,
            userId: USER_ID,
            createdAt: new Date(),
            updatedAt: new Date(),
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
            id: COUPON_ID,
            code: COUPON_CODE,
            discountPercentage: DISCOUNT_PERCENTAGE,
            expirationDate: new Date(Date.now() + 10000),
            isActive: false,
            userId: USER_ID,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        mockCouponRepository.findByCodeAndUserId.mockResolvedValue(inactiveCoupon);

        await expect(couponValidator.validate(COUPON_CODE, USER_ID))
            .rejects
            .toThrow("Coupon is not active");
    });
});