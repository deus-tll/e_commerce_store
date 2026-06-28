import { Schema, model, InferSchemaType, Types } from "mongoose";

const reviewSchema = new Schema({
	product: {
		type: Schema.Types.ObjectId,
		ref: "Product",
		required: true,
		index: true
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	},
	comment: {
		type: String,
		trim: true,
		required: true,
	}
}, {
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export type IReviewDoc = InferSchemaType<typeof reviewSchema> & {
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const Review = model("Review", reviewSchema);

export default Review;