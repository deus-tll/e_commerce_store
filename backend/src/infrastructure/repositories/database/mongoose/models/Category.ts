import { Schema, model, InferSchemaType, Types } from "mongoose";

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
	_id: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
};

const Category = model("Category", categorySchema);

export default Category;