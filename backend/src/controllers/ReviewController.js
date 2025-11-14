import {IReviewService} from "../interfaces/review/IReviewService.js";
import {CreateReviewDTO, UpdateReviewDTO} from "../domain/index.js";

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

			const createReviewDTO = new CreateReviewDTO({
				productId,
				userId,
				rating,
				comment
			});

			const reviewDTO = await this.#reviewService.create(createReviewDTO);

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

			const updateReviewDTO = new UpdateReviewDTO({
				reviewId,
				userId,
				rating,
				comment
			});

			const reviewDTO = await this.#reviewService.update(updateReviewDTO);

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

			const reviewDTO = await this.#reviewService.delete(userId, reviewId);

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
			const page = req.query.page;
			const limit = req.query.limit;

			const result = await this.#reviewService.getAllByProduct(productId, page, limit);

			return res.status(200).json(result);
		}
		catch (error) {
			next(error);
		}
	}
}