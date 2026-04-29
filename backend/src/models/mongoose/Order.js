import mongoose from "mongoose";
import {OrderStatus, OrderStatusValues} from "../../constants/domain.js";

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
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
}, { _id: false });

const customerDetailsSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	phone: { type: String, required: true },
	address: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	customerDetails: {
		type: customerDetailsSchema,
		required: true
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
	status: {
		type: String,
		enum: OrderStatusValues,
		default: OrderStatus.AWAITING_PAYMENT,
		index: true
	},
	paymentSessionId: {
		type: String,
		unique: true,
		index: true,
		sparse: true
	},
	orderNumber: {
		type: String,
		unique: true,
		required: true,
		index: true,
	},
}, { timestamps: true });

orderSchema.index({ user: 1, "products.product": 1 });

/**
 * @type {import('mongoose').Model & import('mongoose').Document}
 */
const Order = mongoose.model("Order", orderSchema);

export default Order;