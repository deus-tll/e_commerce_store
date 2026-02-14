import {
	UserEntity,
	CartEntity, CartItemEntity,
	CategoryEntity,
	CouponEntity,
	OrderEntity, OrderProductItem,
	ProductEntity,
	ReviewEntity, ProductImage, ProductAttribute, ProductRatingStats
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

		const { user, items, ...rest } = plainObject;

		const processedItems = items.map(item => new CartItemEntity({
			productId: item.product?.toString(),
			quantity: item.quantity
		}));

		return new CartEntity({
			...rest,
			userId: user?.toString(),
			items: processedItems
		});
	}

	/**
	 * Converts a Mongoose Category Document/object to a CategoryEntity.
	 * @param {object | null} doc
	 * @returns {CategoryEntity | null}
	 */
	static toCategoryEntity(doc) {
		const plainObject = MongooseAdapter.#toPlainObject(doc);

		if (!plainObject) return null;

		const { allowedAttributes, ...rest } = plainObject;

		return new CategoryEntity({
			...rest,
			allowedAttributes: allowedAttributes || [],
		});
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
			id: item.product?.toString(),
			quantity: item.quantity,
			price: item.price,
			name: item.name,
			image: item.image
		}));

		const { user, ...rest } = plainObject;

		return new OrderEntity({
			...rest,
			userId: user ? user.toString() : null,
			products: products
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

		const { category, images, attributes, ratingStats, ...rest } = plainObject;

		return new ProductEntity({
			...rest,
			images: new ProductImage(images),
			categoryId: category?.toString(),
			attributes: (attributes || []).map(attr => new ProductAttribute(attr)),
			ratingStats: new ProductRatingStats(ratingStats)
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

		const { product, user, ...rest } = plainObject;

		return new ReviewEntity({
			...rest,
			productId: product?.toString(),
			userId: user?.toString()
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