import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	value: {
		type: String,
		required: true,
		trim: true
	}
}, { _id: false });

const imageSchema = new mongoose.Schema({
	mainImage: {
		type: String,
		required: true
	},
	additionalImages: {
		type: [String],
		default: []
	}
}, { _id: false });

const ratingStatsSchema = new mongoose.Schema({
	averageRating: {
		type: Number,
		default: 0,
		min: 0,
		max: 5
	},
	totalReviews: {
		type: Number,
		default: 0,
		min: 0
	},
	ratingSum: {
		type: Number,
		default: 0,
		min: 0
	}
}, { _id: false });

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		min: 0,
		required: true
	},
	stock: {
		type: Number,
		required: true,
		min: 0,
		default: 0
	},
	images: {
		type: imageSchema,
		required: [true, "Product must have images data."]
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true,
		index: true
	},
	attributes: {
		type: [attributeSchema],
		default: []
	},
	isFeatured: {
		type: Boolean,
		default: false
	},
	ratingStats: {
		type: ratingStatsSchema,
		default: {}
	}
}, { timestamps: true });

productSchema.index({ "attributes.name": 1, "attributes.value": 1 });

/**
 * @type {import('mongoose').Model & import('mongoose').Document}
 */
const Product = mongoose.model("Product", productSchema);

export default Product;