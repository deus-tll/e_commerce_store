import {IReviewService} from "../../interfaces/review/IReviewService.js";
import {IReviewRepository} from "../../interfaces/repositories/IReviewRepository.js";
import {IReviewMapper} from "../../interfaces/mappers/IReviewMapper.js";
import {IProductStatsService} from "../../interfaces/product/IProductStatsService.js";
import {IReviewValidator} from "../../interfaces/review/IReviewValidator.js";
import {ReviewPaginationResultDTO, PaginationMetadata} from "../../domain/index.js";

import {NotFoundError} from "../../errors/apiErrors.js";

/**
 * Agnostic business logic layer for review operations.
 * Coordinates between the Review Repository, Product Service, and User Service.
 * @augments IReviewService
 */
export class ReviewService extends IReviewService {
	/** @type {IReviewRepository} */ #reviewRepository;
	/** @type {IReviewMapper} */ #reviewMapper;
	/** @type {IProductStatsService} */ #productStatsService;
	/** @type {IReviewValidator} */ #reviewValidator;

	/**
	 * @param {IReviewRepository} reviewRepository
	 * @param {IReviewMapper} reviewMapper
	 * @param {IProductStatsService} productStatsService
	 * @param {IReviewValidator} reviewValidator
	 */
	constructor(reviewRepository, reviewMapper, productStatsService, reviewValidator) {
		super();
		this.#reviewRepository = reviewRepository;
		this.#reviewMapper = reviewMapper;
		this.#productStatsService = productStatsService;
		this.#reviewValidator = reviewValidator;
	}

	/**
	 * Finds a review by ID and User ID, throwing NotFoundError if not found.
	 * This encapsulates the 'orFail' logic within the service.
	 * @param {string} reviewId
	 * @param {string} userId
	 * @returns {Promise<Object>} The existing review entity.
	 */
	async #getReviewOrFail(reviewId, userId) {
		const existingReview = await this.#reviewRepository.findByIdAndUserId(reviewId, userId);
		if (!existingReview) {
			throw new NotFoundError("Review not found or not owned by user");
		}
		return existingReview;
	}

	async create(data) {
		await this.#reviewValidator.validateCreation(data.productId, data.userId);

		const createdReview = await this.#reviewRepository.create(data);

		await this.#productStatsService.handleReviewCreation(
			createdReview.productId,
			createdReview.rating
		);

		return await this.#reviewMapper.toDTO(createdReview);
	}

	async update(data) {
		const existingReview = await this.#getReviewOrFail(data.reviewId, data.userId);

		const oldRating = existingReview.rating;

		const updatedReview = await this.#reviewRepository.updateByIdAndUserId(data);
		if (!updatedReview) throw new NotFoundError("Failed to update review.");

		const newRating = updatedReview.rating;

		await this.#productStatsService.handleReviewUpdate(
			updatedReview.productId,
			newRating,
			oldRating
		);

		return await this.#reviewMapper.toDTO(updatedReview);
	}

	async delete(userId, reviewId) {
		const deletedReview = await this.#reviewRepository.deleteByIdAndUserId(reviewId, userId);
		if (!deletedReview) throw new NotFoundError("Review not found or not owned by user");

		await this.#productStatsService.handleReviewDeletion(
			deletedReview.productId,
			deletedReview.rating
		);

		return await this.#reviewMapper.toDTO(deletedReview);
	}

	async getAllByProduct(productId, page = 1, limit = 10) {
		await this.#reviewValidator.validateProductExistence(productId);

		const skip = (page - 1) * limit;

		const repositoryPaginationResult = await this.#reviewRepository.findAndCountByProduct(productId, skip, limit);

		const total = repositoryPaginationResult.total;
		const pages = Math.ceil(total / limit);

		const reviewDTOs = await this.#reviewMapper.toDTOs(repositoryPaginationResult.results);
		const paginationMetadata = new PaginationMetadata(page, limit, total, pages);

		return new ReviewPaginationResultDTO(reviewDTOs, paginationMetadata);
	}
}