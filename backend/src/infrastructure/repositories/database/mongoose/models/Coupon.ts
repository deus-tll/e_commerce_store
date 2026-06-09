import { Schema, model, InferSchemaType, Types } from "mongoose";

const couponSchema  = new Schema({
	code: {
		type: String,
		required: true,
		unique: true,
	},
	discountPercentage: {
		type: Number,
		required: true,
		min: 0,
		max: 100,
	},
	expirationDate: {
		type: Date,
		required: true,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	}
}, {
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

export type ICouponDoc = InferSchemaType<typeof couponSchema> & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const Coupon = model("Coupon", couponSchema);

export default Coupon;