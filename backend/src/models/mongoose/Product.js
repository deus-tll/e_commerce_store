import mongoose from "mongoose";

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
	isFeatured: {
		type: Boolean,
		default: false
	},
	ratingStats: {
		type: ratingStatsSchema,
		default: () => ({})
	}
}, { timestamps: true });

/**
 * @type {import('mongoose').Model & import('mongoose').Document}
 */
const Product = mongoose.model("Product", productSchema);

export default Product;