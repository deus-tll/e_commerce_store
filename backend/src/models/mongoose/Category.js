import mongoose from "mongoose";
import {toSlug} from "../../utils/slugify.js";

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

categorySchema.pre("validate", function(next) {
	if (!this.slug && this.name) {
		this.slug = toSlug(this.name);
	}
	if (this.isModified("name")) {
		this.slug = toSlug(this.name);
	}
	return next();
});

/**
 * @type {import('mongoose').Model & import('mongoose').Document}
 */
const Category = mongoose.model("Category", categorySchema);

export default Category;