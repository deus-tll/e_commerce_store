import Product from "../models/Product.js";
import {NotFoundError} from "../errors/apiErrors.js";


export class CartService {
	async getCartProducts(user) {
		const cartItems = user.cartItems;
		const productIds = cartItems.map(item => item.product);
		const products = await Product.find({ _id: { $in: productIds } });

		return products.map((product) => {
			const item = cartItems.find((cartItem) => cartItem.product.toString() === product._id.toString());
			return { ...product.toJSON(), quantity: item.quantity };
		});
	}

	async addProductToCart(user, productId) {
		const existingItem = user.cartItems.find((item) => item.product.toString() === productId.toString());

		if (existingItem) {
			existingItem.quantity++;
		} else {
			user.cartItems.push({ product: productId, quantity: 1 });
		}

		await user.save();
		return user.cartItems;
	}

	async removeProductFromCart(user, productId) {
		user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId.toString());
		await user.save();
		return user.cartItems;
	}

	async clearCart(user) {
		user.cartItems = [];
		await user.save();
		return user.cartItems;
	}

	async updateProductQuantityInCart(user, productId, quantity) {
		const existingItem = user.cartItems.find((item) => item.product.toString() === productId.toString());

		if (!existingItem) {
			throw new NotFoundError('Product not found in cart');
		}

		if (quantity === 0) {
			user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId.toString());
		} else {
			existingItem.quantity = quantity;
		}

		await user.save();
		return user.cartItems;
	}
}