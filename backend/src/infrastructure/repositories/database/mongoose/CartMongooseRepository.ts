import Cart, {ICartDoc} from "./models/Cart.js";

import {ICartRepository} from "../../../../application/cart/ICartRepository.js";
import {CartAdapter} from "./adapters/CartAdapter.js";

import {CartEntity} from "../../../../entities/cart/CartEntity.js";
import {CartItem} from "../../../../entities/cart/types/CartItem.js";

import {EntityNotFoundError} from "../../../../errors/index.js";

export class CartMongooseRepository extends ICartRepository {
	private toEntityOrThrow(doc?: ICartDoc | null, criteria: any = {}): CartEntity {
		const entity = CartAdapter.toEntity(doc);

		if (!entity) throw new EntityNotFoundError("Cart", criteria);

		return entity;
	}

	async addItemOrIncrementQuantity(userId: string, productId: string): Promise<CartEntity> {
		let updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId, "items.product": productId },
			{ $inc: { "items.$.quantity": 1 } },
			{ new: true, lean: true }
		);

		if (!updatedDoc) {
			updatedDoc = await Cart.findOneAndUpdate(
				{ user: userId },
				{ $push: { items: { product: productId, quantity: 1 } } },
				{ new: true, upsert: true, lean: true }
			);
		}

		return this.toEntityOrThrow(updatedDoc, { userId, productId });
	}

	async removeItem(userId: string, productId: string): Promise<CartEntity> {
		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId },
			{ $pull: { items: { product: productId } } },
			{ new: true, lean: true }
		);

		return this.toEntityOrThrow(updatedDoc, { userId, productId });
	}

	async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<CartEntity> {
		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId, "items.product": productId },
			{ $set: { "items.$.quantity": quantity } },
			{ new: true, runValidators: true, lean: true }
		);

		return this.toEntityOrThrow(updatedDoc, { userId, productId });
	}

	async updateItemsByUserId(userId: string, newItems: CartItem[]): Promise<CartEntity> {
		const updateOptions = { new: true, runValidators: true, upsert: false, lean: true };

		const mongooseItems = newItems.map(item => ({
			product: item.productId,
			quantity: item.quantity
		}));

		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId },
			{ items: mongooseItems },
			updateOptions
		);

		return this.toEntityOrThrow(updatedDoc, {
			userId,
			productIds: newItems.map(i => i.productId),
		});
	}

	async findByUserId(userId: string): Promise<CartEntity | null> {
		const foundDoc = await Cart.findOne({ user: userId }).lean();
		return CartAdapter.toEntity(foundDoc);
	}
}