import mongoose from "mongoose";

/**
 * Defines the schema for a single product item within an order.
 * This structure includes snapshot data (name, image) to ensure order immutability.
 */
const orderProductItemSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Product",
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	productName: {
		type: String,
		required: true,
	},
	productMainImage: {
		type: String,
		required: true,
	},
}, { _id: false });

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	products: {
		type: [orderProductItemSchema],
		required: true
	},
	totalAmount: {
		type: Number,
		required: true,
		min: 0,
	},
	paymentSessionId: {
		type: String,
		unique: true,
	},
}, { timestamps: true });

/**
 * @type {import('mongoose').Model & import('mongoose').Document}
 */
const Order = mongoose.model("Order", orderSchema);

export default Order;