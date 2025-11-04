import Cart from "../../models/mongoose/Cart.js";

import {ICartRepository} from "../../interfaces/repositories/ICartRepository.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

export class CartMongooseRepository extends ICartRepository {
	async create(data) {
		const docData = {
			user: data.userId,
			items: data.items.map(item => ({
				product: item.productId,
				quantity: item.quantity
			}))
		};

		const createdDoc = await Cart.create(docData);

		return MongooseAdapter.toCartEntity(createdDoc);
	}

	async addItemOrIncrement(userId, productId) {
		const updateOptions = { new: true, runValidators: true, upsert: false, lean: true };

		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId, "items.product": productId },
			{ $inc: { "items.$.quantity": 1 } },
			updateOptions
		);

		if (!updatedDoc) {
			// Item not found, so push a new item to the array
			const newDoc = await Cart.findOneAndUpdate(
				{ user: userId },
				{ $push: { items: { product: productId, quantity: 1 } } },
				updateOptions
			);
			return MongooseAdapter.toCartEntity(newDoc);
		}

		return MongooseAdapter.toCartEntity(updatedDoc);
	}

	async removeItem(userId, productId) {
		const updateOptions = { new: true, runValidators: true, lean: true };

		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId },
			{ $pull: { items: { product: productId } } },
			updateOptions
		);

		return MongooseAdapter.toCartEntity(updatedDoc);
	}

	async updateItemQuantity(userId, productId, quantity) {
		const updateOptions = { new: true, runValidators: true, lean: true };

		if (quantity === 0) {
			// Quantity zero means remove the item
			return this.removeItem(userId, productId);
		}

		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId, "items.product": productId },
			{ $set: { "items.$.quantity": quantity } },
			updateOptions
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
		const foundDoc = await Cart.findOne({ user: userId }).lean();
		return MongooseAdapter.toCartEntity(foundDoc);
	}

	async existsByUserId(userId) {
		const exists = await Cart.existsById({ user: userId });
		return !!exists;
	}
}