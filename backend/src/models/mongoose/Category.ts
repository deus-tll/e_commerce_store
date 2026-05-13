import mongoose, { Schema, model, InferSchemaType } from "mongoose";

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	slug: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
		index: true
	},
	image: {
		type: String,
		required: true
	},
	allowedAttributes: {
		type: [String],
		default: []
	}
}, {
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true },
});

export type ICategoryDoc = InferSchemaType<typeof categorySchema> & {
	_id: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
};

const Category = model("Category", categorySchema);

export default Category;