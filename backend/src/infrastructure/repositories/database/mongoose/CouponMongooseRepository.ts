import Coupon from "./models/Coupon.js";

import {ICouponRepository} from "../../../../application/coupon/ICouponRepository.js";
import {CouponAdapter} from "./adapters/CouponAdapter.js";

import {CouponEntity} from "../../../../entities/coupon/CouponEntity.js";
import {CouponCreatePersistence} from "../../../../application/types/coupon.js";

import {EntityAlreadyExistsError, EntityNotFoundError} from "../../../../errors/index.js";

export class CouponMongooseRepository extends ICouponRepository {
	async replaceOrCreate(userId: string, data: CouponCreatePersistence): Promise<CouponEntity> {
		try {
			const updatedDoc = await Coupon.findOneAndReplace(
				{ user: userId },
				{ ...data, user: userId },
				{ upsert: true, new: true, runValidators: true }
			).lean();

			return CouponAdapter.toEntity(updatedDoc);
		}
		catch (error) {
			const keyPattern = error['keyPattern'];
			if (error.code === 11000 && keyPattern?.code) {
				throw new EntityAlreadyExistsError("Coupon", { code: data.code });
			}
			throw error;
		}
	}

	async updateCouponActiveState(couponCode: string, userId: string, isActive: boolean): Promise<CouponEntity> {
		const updatedDoc = await Coupon.findOneAndUpdate(
			{ code: couponCode, user: userId },
			{ $set: { isActive } },
			{ new: true, runValidators: true }
		).lean();

		if (!updatedDoc) throw new EntityNotFoundError("Coupon", { code: couponCode, userId });

		return CouponAdapter.toEntity(updatedDoc);
	}

	async findByCodeAndUserId(code: string, userId: string): Promise<CouponEntity | null> {
		const foundDoc = await Coupon.findOne({ code, user: userId }).lean();
		return CouponAdapter.toEntity(foundDoc);
	}

	async findActiveByUserId(userId: string): Promise<CouponEntity | null> {
		const foundDoc = await Coupon.findOne({ user: userId, isActive: true }).lean();
		return CouponAdapter.toEntity(foundDoc);
	}
}