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

function toSlug(value) {
	return value
		.toString()
		.trim()
		.toLowerCase()
		.replace(/['"]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}

categorySchema.pre("validate", function(next) {
	if (!this.slug && this.name) {
		this.slug = toSlug(this.name);
	}
	if (this.isModified("name")) {
		this.slug = toSlug(this.name);
	}
	return next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;