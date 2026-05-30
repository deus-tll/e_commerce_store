import {Schema, Types, model, InferSchemaType} from "mongoose";

const cartItemSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
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

const cartSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
		index: true
	},
	items: [cartItemSchema]
}, {
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

export type ICartDoc = InferSchemaType<typeof cartSchema> & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const Cart = model("Cart", cartSchema);

export default Cart;