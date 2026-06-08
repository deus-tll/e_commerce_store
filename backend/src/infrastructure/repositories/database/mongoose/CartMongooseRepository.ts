import Cart from "./models/Cart.js";

import {ICartRepository} from "../../../../application/cart/ICartRepository.js";
import {CartAdapter} from "./adapters/CartAdapter.js";

import {CartEntity} from "../../../../entities/cart/CartEntity.js";
import {CartItem} from "../../../../entities/cart/types/CartItem.js";

import {EntityNotFoundError} from "../../../../errors/index.js";

export class CartMongooseRepository extends ICartRepository {
	async addItemOrIncrementQuantity(userId: string, productId: string): Promise<CartEntity | null> {
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

		return CartAdapter.toEntity(updatedDoc);
	}

	async removeItem(userId: string, productId: string): Promise<CartEntity | null> {
		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId },
			{ $pull: { items: { product: productId } } },
			{ new: true, lean: true }
		);

		return CartAdapter.toEntity(updatedDoc);
	}

	async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<CartEntity | null> {
		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId, "items.product": productId },
			{ $set: { "items.$.quantity": quantity } },
			{ new: true, runValidators: true, lean: true }
		);

		if (!updatedDoc) {
			throw new EntityNotFoundError("Cart", { productId });
		}

		return CartAdapter.toEntity(updatedDoc);
	}

	async updateItemsByUserId(userId: string, newItems: CartItem[]): Promise<CartEntity | null> {
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

		return CartAdapter.toEntity(updatedDoc);
	}

	async findByUserId(userId: string): Promise<CartEntity | null> {
		const foundDoc = await Cart.findOne({ user: userId }).lean();
		return CartAdapter.toEntity(foundDoc);
	}
}