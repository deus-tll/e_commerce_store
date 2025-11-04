import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
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
		type: String
	}
}, { timestamps: true });

/**
 * @type {import('mongoose').Model & import('mongoose').Document}
 */
const Category = mongoose.model("Category", categorySchema);

export default Category;