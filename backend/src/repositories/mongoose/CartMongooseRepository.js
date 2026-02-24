import Cart from "../../models/mongoose/Cart.js";

import {ICartRepository} from "../../interfaces/repositories/ICartRepository.js";
import {MongooseAdapter} from "../adapters/MongooseAdapter.js";

import {EntityNotFoundError} from "../../errors/index.js";

export class CartMongooseRepository extends ICartRepository {
	async addProductOrIncrement(userId, productId) {
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

	async removeProduct(userId, productId) {
		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId },
			{ $pull: { items: { product: productId } } },
			{ new: true, lean: true }
		);

		return MongooseAdapter.toCartEntity(updatedDoc);
	}

	async updateProductQuantity(userId, productId, quantity) {
		const updatedDoc = await Cart.findOneAndUpdate(
			{ user: userId, "items.product": productId },
			{ $set: { "items.$.quantity": quantity } },
			{ new: true, runValidators: true, lean: true }
		);

		if (!updatedDoc) {
			throw new EntityNotFoundError("CartItem", { productId });
		}

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
}