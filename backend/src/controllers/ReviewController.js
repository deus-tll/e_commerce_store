import {IReviewService} from "../interfaces/review/IReviewService.js";
import {CreateReviewDTO, UpdateReviewDTO} from "../domain/index.js";

import {BadRequestError} from "../errors/apiErrors.js";

/**
 * Handles incoming HTTP requests related to product reviews, extracting request data,
 * mapping it to DTOs, and delegating business logic to the IReviewService.
 */
export class ReviewController {
	/** @type {IReviewService} */ #reviewService;

	/**
	 * @param {IReviewService} reviewService - An instance of the object that implements IReviewService contract.
	 */
	constructor(reviewService) {
		this.#reviewService = reviewService;
	}

	/**
	 * Adds a new review to a product. Extracts necessary data from the request, maps it
	 * to a `CreateReviewDTO` using the product and user IDs, and delegates to the service. (Authenticated).
	 * @param {object} req - Express request object. Expects 'id' (productId) in req.params, 'rating' and 'comment' in 'req.body', and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 201 and the created ReviewDTO.
	 */
	create = async (req, res, next) => {
		try {
			const { id: productId } = req.params;
			const { rating, comment } = req.body;
			const userId = req.userId;

			if (!productId || !productId.trim()) {
				throw new BadRequestError("Product ID is required");
			}

			if (!rating || rating < 1 || rating > 5) {
				throw new BadRequestError("Rating must be between 1 and 5");
			}

			if (!comment?.trim()) {
				throw new BadRequestError("Comment cannot be empty");
			}

			const creationData = new CreateReviewDTO({
				productId: productId.trim(),
				userId: userId,
				rating: rating,
				comment: comment.trim()
			});

			const reviewDTO = await this.#reviewService.create(creationData);

			return res.status(201).json(reviewDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Updates an existing review owned by the requesting user. Extracts the review ID,
	 * user ID, and partial update data, maps it to an `UpdateReviewDTO`, and delegates. (Authenticated).
	 * @param {object} req - Express request object. Expects 'reviewId' in req.params, 'rating' and/or 'comment' in 'req.body', and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the updated ReviewDTO.
	 */
	update = async (req, res, next) => {
		try {
			const { reviewId } = req.params;
			const { rating, comment } = req.body;
			const userId = req.userId;

			if (!reviewId || !reviewId.trim()) {
				throw new BadRequestError("Review ID is required");
			}

			const hasRating = rating !== undefined;
			const hasComment = comment !== undefined;

			if (hasRating && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
				throw new BadRequestError("Rating must be a number between 1 and 5.");
			}
			if (hasComment && !comment.trim()) {
				throw new BadRequestError("Comment cannot be empty.");
			}
			if (!hasRating && !hasComment) {
				throw new BadRequestError("At least 'rating' or 'comment' must be provided for update.");
			}

			const updateData = new UpdateReviewDTO({
				reviewId: reviewId.trim(),
				userId: userId,
				rating: hasRating ? rating : undefined,
				comment: hasComment ? comment.trim() : undefined
			});

			const reviewDTO = await this.#reviewService.update(updateData);

			return res.status(200).json(reviewDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Deletes a review owned by the requesting user. Extracts the review ID and user ID,
	 * and delegates the deletion operation. (Authenticated).
	 * @param {object} req - Express request object. Expects 'reviewId' in req.params and 'userId' in req.userId.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and the deleted ReviewDTO.
	 */
	delete = async (req, res, next) => {
		try {
			const { reviewId } = req.params;
			const userId = req.userId;

			if (!reviewId || !reviewId.trim()) {
				throw new BadRequestError("Review ID is required");
			}

			const reviewDTO = await this.#reviewService.delete(userId, reviewId.trim());

			return res.status(200).json(reviewDTO);
		}
		catch (error) {
			next(error);
		}
	}

	/**
	 * Gets a paginated list of reviews for a specific product. Extracts product ID and
	 * pagination parameters, delegating all logic and default parameter handling to the service. (Public endpoint).
	 * @param {object} req - Express request object. Expects 'id' (productId) in req.params, and optional 'page'/'limit' in req.query.
	 * @param {object} res - Express response object.
	 * @param {function} next - Express next middleware function.
	 * @returns {Promise<void>} - Responds with status 200 and a ReviewPaginationResultDTO.
	 */
	getByProduct = async (req, res, next) => {
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

			const result = await this.#reviewService.getAllByProduct(productId.trim(), page, limit);

			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}
}