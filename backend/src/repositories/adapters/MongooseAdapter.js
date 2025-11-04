import {
	UserEntity,
	CartEntity, CartItemEntity,
	CategoryEntity,
	CouponEntity,
	OrderEntity, OrderProductItem,
	ProductEntity,
	ReviewEntity
} from "../../domain/index.js";

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
	 * Converts a Mongoose Cart Document/object to a CartEntity.
	 * Handles the nested conversion of cart items.
	 * @param {object | null} doc
	 * @returns {CartEntity | null}
	 */
	static toCartEntity(doc) {
		const plainObject = MongooseAdapter.#toPlainObject(doc);

		if (!plainObject) return null;

		const items = plainObject.items.map(item => new CartItemEntity({
			productId: item.product.toString(),
			quantity: item.quantity
		}));

		return new CartEntity({
			id: plainObject.id,
			userId: plainObject.user.toString(),
			items: items,
			createdAt: plainObject.createdAt,
			updatedAt: plainObject.updatedAt,
		});
	}

	/**
	 * Converts a Mongoose Category Document/object to a CategoryEntity.
	 * @param {object | null} doc
	 * @returns {CategoryEntity | null}
	 */
	static toCategoryEntity(doc) {
		const data = MongooseAdapter.#toPlainObject(doc);
		return data ? new CategoryEntity(data) : null;
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
			userId: plainObject.userId.toString()
		});
	}

	/**
	 * Converts a Mongoose Order Document/object to an OrderEntity.
	 * Handles the nested conversion of order product items.
	 * @param {object | null} doc
	 * @returns {OrderEntity | null}
	 */
	static toOrderEntity(doc) {
		const plainObject = MongooseAdapter.#toPlainObject(doc);

		if (!plainObject) return null;

		const products = plainObject.products.map(item => new OrderProductItem({
			productId: item.product.toString(),
			quantity: item.quantity,
			price: item.price,
			productName: item.productName,
			productMainImage: item.productMainImage
		}));

		return new OrderEntity({
			id: plainObject.id,
			userId: plainObject.user.toString(),
			products: products,
			totalAmount: plainObject.totalAmount,
			paymentSessionId: plainObject.paymentSessionId,
			createdAt: plainObject.createdAt,
			updatedAt: plainObject.updatedAt,
		});
	}

	/**
	 * Converts a Mongoose Product Document/object to a ProductEntity.
	 * Handles the mapping of the Mongoose `category` reference field, nested `images`,
	 * and the nested `ratingStats`.
	 * @param {object | null} doc
	 * @returns {ProductEntity | null}
	 */
	static toProductEntity(doc) {
		const plainObject = MongooseAdapter.#toPlainObject(doc);

		if (!plainObject) return null;

		return new ProductEntity({
			id: plainObject.id,
			name: plainObject.name,
			description: plainObject.description,
			price: plainObject.price,
			images: plainObject.images,
			isFeatured: plainObject.isFeatured,
			categoryId: plainObject.category.toString(),
			ratingStats: plainObject.ratingStats,
			createdAt: plainObject.createdAt,
			updatedAt: plainObject.updatedAt,
		});
	}

	/**
	 * Converts a Mongoose Review Document/object to a ReviewEntity.
	 * Handles the mapping of the Mongoose `product` and `user` reference fields.
	 * @param {object | null} doc
	 * @returns {ReviewEntity | null}
	 */
	static toReviewEntity(doc) {
		const plainObject = MongooseAdapter.#toPlainObject(doc);

		if (!plainObject) return null;

		return new ReviewEntity({
			id: plainObject.id,
			productId: plainObject.product.toString(),
			userId: plainObject.user.toString(),
			rating: plainObject.rating,
			comment: plainObject.comment,
			createdAt: plainObject.createdAt,
			updatedAt: plainObject.updatedAt,
		});
	}

	/**
	 * Converts a Mongoose User Document/object to a UserEntity.
	 * @param {object | null} doc
	 * @returns {UserEntity | null}
	 */
	static toUserEntity(doc) {
		const data = MongooseAdapter.#toPlainObject(doc);
		return data ? new UserEntity(data) : null;
	}
}