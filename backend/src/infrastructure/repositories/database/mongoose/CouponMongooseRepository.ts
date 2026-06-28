import {MongoServerError} from "mongodb";
import Coupon, {ICouponDoc} from "./models/Coupon.js";

import {ICouponRepository} from "../../../../application/coupon/ICouponRepository.js";
import {CouponAdapter} from "./adapters/CouponAdapter.js";

import {CouponEntity} from "../../../../entities/coupon/CouponEntity.js";
import {CouponCreatePersistence} from "../../../../application/types/coupon.js";

import {EntityAlreadyExistsError, EntityNotFoundError} from "../../../../errors/index.js";

export class CouponMongooseRepository extends ICouponRepository {
	private toEntityOrThrow(doc?: ICouponDoc | null, criteria: any = {}): CouponEntity {
		const entity = CouponAdapter.toEntity(doc);

		if (!entity) throw new EntityNotFoundError("Coupon", criteria);

		return entity;
	}

	async replaceOrCreate(userId: string, data: CouponCreatePersistence): Promise<CouponEntity> {
		try {
			const updatedDoc = await Coupon.findOneAndReplace(
				{ user: userId },
				{ ...data, user: userId },
				{ upsert: true, new: true, runValidators: true }
			).lean();

			return CouponAdapter.toEntityRequired(updatedDoc);
		}
		catch (error: unknown) {
			if (error instanceof MongoServerError && error.code === 11000) {
				const keyPattern = error.keyPattern as Record<string, unknown> | undefined;

				if (keyPattern?.code) {
					throw new EntityAlreadyExistsError("Coupon", { code: data.code });
				}

				if (keyPattern?.user) {
					throw new EntityAlreadyExistsError("Coupon", { user: userId });
				}
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

		return this.toEntityOrThrow(updatedDoc, { code: couponCode, userId });
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