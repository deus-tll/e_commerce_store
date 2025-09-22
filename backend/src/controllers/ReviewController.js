import {ReviewService} from "../services/ReviewService.js";
import {BadRequestError} from "../errors/apiErrors.js";

export class ReviewController {
	constructor() {
		this.reviewService = new ReviewService();
	}

	addReview = async (req, res, next) => {
		try {
			const { id: productId } = req.params;
			const { rating, comment } = req.body;

			if (!productId || !productId.trim()) {
				throw new BadRequestError("Product ID is required");
			}

			if (!rating || rating < 1 || rating > 5) {
				throw new BadRequestError("Rating must be between 1 and 5");
			}

			if (!comment?.trim()) {
				throw new BadRequestError("Comment cannot be empty");
			}

			const review = await this.reviewService.addReview(
				req.userId,
				productId.trim(),
				{
					rating,
					comment: comment.trim()
				}
			);

			const reviewDTO = this.reviewService.toDTO(review);

			reviewDTO.user = {
				id: req.user._id.toString(),
				name: req.user.name
			};

			return res.status(201).json(reviewDTO);
		}
		catch (error) {
			next(error);
		}
	}

	updateReview = async (req, res, next) => {
		try {
			const { reviewId } = req.params;
			const { rating, comment } = req.body;

			if (!reviewId || !reviewId.trim()) {
				throw new BadRequestError("Review ID is required");
			}

			if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
				throw new BadRequestError("Rating must be a number between 1 and 5");
			}

			if (!comment || !comment.trim()) {
				throw new BadRequestError("Comment is required");
			}

			const updateData = {
				rating: rating,
				comment: comment.trim()
			};

			const review = await this.reviewService.updateReview(req.userId, reviewId.trim(), updateData);

			const reviewDTO = this.reviewService.toDTO(review);

			reviewDTO.user = {
				id: req.user._id.toString(),
				name: req.user.name
			};

			return res.status(200).json(reviewDTO);
		}
		catch (error) {
			next(error);
		}
	}

	deleteReview = async (req, res, next) => {
		try {
			const { reviewId } = req.params;

			if (!reviewId || !reviewId.trim()) {
				throw new BadRequestError("Review ID is required");
			}

			const review = await this.reviewService.deleteReview(req.userId, reviewId.trim());

			const reviewDTO = this.reviewService.toDTO(review);

			reviewDTO.user = {
				id: req.user._id.toString(),
				name: req.user.name
			};

			return res.status(200).json(reviewDTO);
		}
		catch (error) {
			next(error);
		}
	}

	getReviewsByProduct = async (req, res, next) => {
		try {
			const { id: productId } = req.params;
			const page = parseInt(req.query.page) || 1;
			const limit = parseInt(req.query.limit) || 10;

			if (!productId || !productId.trim()) {
				throw new BadRequestError("Product ID is required");
			}

			if (page < 1 || limit < 1) {
				throw new BadRequestError("Page and limit must be positive numbers");
			}

			if (limit > 50) {
				throw new BadRequestError("Limit cannot exceed 50 reviews per page");
			}

			const result = await this.reviewService.getReviewsByProduct(productId.trim(), page, limit);

			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}
}