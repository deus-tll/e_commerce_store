import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
		index: true
	},
	quantity: {
		type: Number,
		min: 1,
		default: 1,
		required: true
	}
}, { _id: false, timestamps: true });

const cartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
		index: true
	},
	items: [cartItemSchema]
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;