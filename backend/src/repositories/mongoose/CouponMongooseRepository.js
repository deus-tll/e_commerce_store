import Coupon from "../../models/mongoose/Coupon.js";

import {ICouponRepository} from "../../interfaces/repositories/ICouponRepository.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {EntityAlreadyExistsError, EntityNotFoundError} from "../../errors/index.js";

export class CouponMongooseRepository extends ICouponRepository {
	async replaceOrCreate(userId, data) {
		try {
			const updatedDoc = await Coupon.findOneAndReplace(
				{ userId: userId },
				{ ...data, userId: userId },
				{ upsert: true, new: true, runValidators: true }
			).lean();

			return MongooseAdapter.toCouponEntity(updatedDoc);
		}
		catch (error) {
			const keyPattern = error['keyPattern'];
			if (error.code === 11000 && keyPattern?.code) {
				throw new EntityAlreadyExistsError("Coupon", { code: data.code });
			}
			throw error;
		}
	}

	async updateCouponActiveState(couponCode, userId, isActive) {
		const updatedDoc = await Coupon.findOneAndUpdate(
			{ code: couponCode, userId },
			{ $set: { isActive } },
			{ new: true, runValidators: true }
		).lean();

		if (!updatedDoc) throw new EntityNotFoundError("Coupon", { code: couponCode, userId });

		return MongooseAdapter.toCouponEntity(updatedDoc);
	}

	async deleteByUserId(userId) {
		const deletedDoc = await Coupon.findOneAndDelete({ userId }).lean();
		return MongooseAdapter.toCouponEntity(deletedDoc);
	}

	async findByCodeAndUserId(code, userId) {
		const foundDoc = await Coupon.findOne({ code, userId }).lean();
		return MongooseAdapter.toCouponEntity(foundDoc);
	}

	async findActiveByUserId(userId) {
		const foundDoc = await Coupon.findOne({ userId, isActive: true }).lean();
		return MongooseAdapter.toCouponEntity(foundDoc);
	}
}