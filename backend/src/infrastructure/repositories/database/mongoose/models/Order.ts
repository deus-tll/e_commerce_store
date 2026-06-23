import { Schema, model, Types } from "mongoose";
import {OrderStatus, OrderStatusValues} from "../../../../../enums/application.js";

const orderProductItemSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
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

const customerDetailsSchema = new Schema({
	fullName: { type: String, required: true },
	phone: { type: String, required: true },
	address: { type: String, required: true }
}, { _id: false });

const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
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
}, {
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

orderSchema.index({ user: 1, "products.product": 1 });

export interface IOrderProductItemDoc {
	product: Types.ObjectId;
	quantity: number;
	price: number;
	name: string;
	image: string;
}

export interface ICustomerDetailsDoc {
	fullName: string;
	phone: string;
	address: string;
}

export interface IOrderDoc {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	customerDetails: ICustomerDetailsDoc;
	products: IOrderProductItemDoc[];
	totalAmount: number;
	status: OrderStatus;
	paymentSessionId?: string;
	orderNumber: string;
	createdAt: Date;
	updatedAt: Date;
}

const Order = model<IOrderDoc>("Order", orderSchema);

export default Order;