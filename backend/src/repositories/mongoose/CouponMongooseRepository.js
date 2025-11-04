import Coupon from "../../models/mongoose/Coupon.js";

import { ICouponRepository } from "../../interfaces/repositories/ICouponRepository.js";

import { MongooseAdapter } from "../adapters/MongooseAdapter.js";

export class CouponMongooseRepository extends ICouponRepository {
	async create(data) {
		const createdDoc = await Coupon.create(data);
		return MongooseAdapter.toCouponEntity(createdDoc);
	}

	async updateByCodeAndUserId(data) {
		const $set = data.toUpdateObject();

		if (Object.keys($set).length === 0) {
			throw new Error("Nothing to update");
		}

		const updateOptions = { new: true, runValidators: true };

		const updatedDoc = await Coupon.findOneAndUpdate(
			{ code: data.code, userId: data.userId },
			{ $set },
			updateOptions
		).lean();

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

	async existsByCode(code) {
		const exists = await Coupon.existsById({ code });
		return !!exists;
	}
}