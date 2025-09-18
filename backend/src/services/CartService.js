import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import {NotFoundError} from "../errors/apiErrors.js";


export class CartService {
	async #getOrCreateCart(userId) {
		let cart = await Cart.findOne({ user: userId });
		if (!cart) {
			cart = await Cart.create({ user: userId, items: [] });
		}
		return cart;
	}

	async getCartProducts(user) {
		const cart = await this.#getOrCreateCart(user._id);
		const productIds = cart.items.map(item => item.product);
		const products = await Product.find({ _id: { $in: productIds } });

		return products.map((product) => {
			const item = cart.items.find((cartItem) => cartItem.product.toString() === product._id.toString());
			return { ...product.toJSON(), quantity: item.quantity };
		});
	}

	async addProductToCart(user, productId) {
		const cart = await this.#getOrCreateCart(user._id);
		const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());

		if (existingItem) {
			existingItem.quantity++;
		} else {
			cart.items.push({ product: productId, quantity: 1 });
		}

		await cart.save();
		return cart.items;
	}

	async removeProductFromCart(user, productId) {
		const cart = await this.#getOrCreateCart(user._id);
		cart.items = cart.items.filter((item) => item.product.toString() !== productId.toString());
		await cart.save();
		return cart.items;
	}

	async clearCart(user) {
		const cart = await this.#getOrCreateCart(user._id);
		cart.items = [];
		await cart.save();
		return cart.items;
	}

	async updateProductQuantityInCart(user, productId, quantity) {
		const cart = await this.#getOrCreateCart(user._id);
		const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());

		if (!existingItem) {
			throw new NotFoundError('Product not found in cart');
		}

		if (quantity === 0) {
			cart.items = cart.items.filter((item) => item.product.toString() !== productId.toString());
		} else {
			existingItem.quantity = quantity;
		}

		await cart.save();
		return cart.items;
	}
}