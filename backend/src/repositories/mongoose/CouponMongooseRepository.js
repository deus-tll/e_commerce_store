import Coupon from "../../models/mongoose/Coupon.js";

import { ICouponRepository } from "../../interfaces/repositories/ICouponRepository.js";

import { MongooseAdapter } from "../adapters/MongooseAdapter.js";
import {EntityNotFoundError} from "../../errors/domainErrors.js";

export class CouponMongooseRepository extends ICouponRepository {
	async create(data) {
		const createdDoc = await Coupon.create(data);
		return MongooseAdapter.toCouponEntity(createdDoc);
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