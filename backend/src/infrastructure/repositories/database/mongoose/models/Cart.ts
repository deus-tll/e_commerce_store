import {Schema, Types, model} from "mongoose";

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

// export type ICartDoc = InferSchemaType<typeof cartSchema> & {
// 	_id: Types.ObjectId;
// 	createdAt: Date;
// 	updatedAt: Date;
// }
//
// const Cart = model("Cart", cartSchema);

export interface ICartItemDoc {
	product: Types.ObjectId;
	quantity: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface ICartDoc {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	items: ICartItemDoc[];
	createdAt: Date;
	updatedAt: Date;
}

const Cart = model<ICartDoc>("Cart", cartSchema);

export default Cart;