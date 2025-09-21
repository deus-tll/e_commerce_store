import {ProductService} from "./ProductService.js";
import {BadRequestError, NotFoundError} from "../errors/apiErrors.js";
import Review from "../models/Review.js";

export class ReviewService {
	constructor() {
		this.productService = new ProductService();
	}

	toDTO(review) {
		return {
			_id: review._id,
			productId: review.product.toString(),
			user: review.user ? {
				id: review.user._id.toString(),
				name: review.user.name
			} : null,
			rating: review.rating,
			comment: review.comment,
			createdAt: review.createdAt,
			updatedAt: review.updatedAt
		}
	}

	async addReview(userId, productId, { rating, comment }) {
		await this.productService.getProductById(productId);

		try {
			return await Review.create({
				product: productId,
				user: userId,
				rating,
				comment
			});
		}
		catch (error) {
			if (error.code === 11000)
			{
				throw new BadRequestError("You have already reviewed this product");
			}

			throw error;
		}
	}

	async updateReview(userId, reviewId, { rating, comment }) {
		const review = await Review.findOneAndUpdate(
			{ _id: reviewId, user: userId },
			{ rating, comment },
			{ new: true, runValidators: true }
		);

		if (!review) throw new NotFoundError("Review not found or not owned by user");

		return review;
	}

	async deleteReview(userId, reviewId) {
		const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });
		if (!review) throw new NotFoundError("Review not found or not owned by user");

		return review;
	}

	async getReviewsByProduct(productId, page = 1, limit = 10) {
		await this.productService.getProductById(productId);

		const skip = (page - 1) * limit;

		const [reviews, total] = await Promise.all([
			Review.find({ product: productId })
				.populate("user", "name")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit),
			Review.countDocuments({ product: productId })
		]);

		return {
			reviews,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit)
			}
		};
	}
}