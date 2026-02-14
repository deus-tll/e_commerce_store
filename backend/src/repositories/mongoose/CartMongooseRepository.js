import Cart from "../../models/mongoose/Cart.js";

import {ICartRepository} from "../../interfaces/repositories/ICartRepository.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";
import {DatabaseError} from "../../errors/databaseErrors.js";

export class CartMongooseRepository extends ICartRepository {
	async addItemOrIncrement(userId, productId) {
		try {
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

			return MongooseAdapter.toCartEntity(updatedDoc);
		}
		catch (error) {
			throw new DatabaseError("Failed to add/increment item in database", error);
		}
	}

	async removeItem(userId, productId) {
		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId },
			{ $pull: { items: { product: productId } } },
			{ new: true, lean: true }
		);

		return MongooseAdapter.toCartEntity(updatedDoc);
	}

	async updateItemQuantity(userId, productId, quantity) {
		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId, "items.product": productId },
			{ $set: { "items.$.quantity": quantity } },
			{ new: true, runValidators: true, lean: true }
		);

		return MongooseAdapter.toCartEntity(updatedDoc);
	}


	async updateItemsByUserId(userId, newItems) {
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

		return MongooseAdapter.toCartEntity(updatedDoc);
	}

	async findByUserId(userId) {
		try {
			const foundDoc = await Cart.findOne({ user: userId }).lean();
			return MongooseAdapter.toCartEntity(foundDoc);
		}
		catch (error) {
			throw new DatabaseError("Failed to fetch cart from database", error);
		}
	}

	async existsByUserId(userId) {
		try {
			const result = await Cart.exists({ user: userId });
			return !!result;
		}
		catch (error) {
			throw new DatabaseError("Failed to check cart existence", error);
		}
	}
}