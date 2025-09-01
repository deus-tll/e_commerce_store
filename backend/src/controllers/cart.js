import Product from "../models/Product.js";

export const getCartProducts = async (req, res) => {
	try {
		const cartItems = req.user.cartItems;
		const products = await Product.find({ _id: { $in: cartItems } });

		const resultCartItems = products.map((product) => {
			const item = cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		return res.status(200).json(resultCartItems);
	}
	catch (error) {
		console.error("Error while getting all products from cart", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const addProductToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			existingItem.quantity++;
		}
		else {
			user.cartItems.push(productId);
		}

		await user.save();

		return res.status(201).json(user.cartItems);
	}
	catch (error) {
		console.error("Error while adding product to a cart", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const removeProductFromCart = async (req, res) => {
	try {
		const { productId } = req.params;
		const user = req.user;

		user.cartItems = user.cartItems.filter((item) => item.id !== productId );

		await user.save();

		return res.status(200).json(user.cartItems);
	}
	catch (error) {
		console.error("Error while removing product from cart", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const clearCart = async (req, res) => {
	try {
		const user = req.user;

		user.cartItems = [];

		await user.save();

		return res.status(204).end();
	}
	catch (error) {
		console.error("Error while clearing a cart", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const updateProductQuantityInCart = async (req, res) => {
	try {
		const { productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			if (quantity === 0)
			{
				user.cartItems.filter((item) => item.id !== productId);
				await user.save();
				return res.status(200).json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			return res.status(200).json(user.cartItems);
		}
		else {
			return res.status(404).json({ message: 'Product not found' });
		}
	}
	catch (error) {
		console.error("Error while updating quantity of the product in a cart", error.message);
		return res.status(500).json({ message: error.message });
	}
};