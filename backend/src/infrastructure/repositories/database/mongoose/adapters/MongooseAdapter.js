import {
	CouponEntity
} from "../../../../../domain/index.js";

/**
 * Utility class responsible for translating data between the Mongoose layer (Models/Documents)
 * and the clean Domain layer (Entities).
 */
export class MongooseAdapter {
	/**
	 * Converts a Mongoose Document or a Mongoose lean object into a clean plain JavaScript object.
	 * It performs the critical _id to id mapping and removes Mongoose metadata.
	 * @param {import('mongoose').Document | object | null | undefined} doc - The Mongoose document or lean object.
	 * @returns {object | null} - A plain object with 'id' instead of '_id', or null.
	 */
	static #toPlainObject(doc) {
		if (!doc) return null;

		// 1. Convert Mongoose Document to plain object (if not already lean)
		// Use toObject with getters and virtuals=false to handle Mongoose defaults/transforms
		const plainObject = doc.toObject ? doc.toObject({ getters: true, virtuals: false }) : doc;

		// 2. Perform the _id to id transformation
		if (plainObject._id) {
			// Mongoose _id can be an ObjectId, so we ensure it's a string
			plainObject.id = plainObject._id.toString();
			delete plainObject._id;
		}

		// 3. Cleanup Mongoose metadata
		delete plainObject["__v"];

		return plainObject;
	}

	/**
	 * Converts a Mongoose Coupon Document/object to a CouponEntity.
	 * Handles the mapping of the Mongoose `userId` reference field.
	 * @param {object | null} doc
	 * @returns {CouponEntity | null}
	 */
	static toCouponEntity(doc) {
		const plainObject = MongooseAdapter.#toPlainObject(doc);

		if (!plainObject) return null;

		return new CouponEntity({
			...plainObject,
			expirationDate: plainObject.expirationDate instanceof Date ? plainObject.expirationDate : new Date(plainObject.expirationDate),
			userId: plainObject.userId?.toString()
		});
	}
}