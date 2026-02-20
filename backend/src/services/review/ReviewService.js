import {IReviewService} from "../../interfaces/review/IReviewService.js";
import {IReviewRepository} from "../../interfaces/repositories/IReviewRepository.js";
import {IReviewMapper} from "../../interfaces/mappers/IReviewMapper.js";
import {IProductStatsService} from "../../interfaces/product/IProductStatsService.js";
import {IReviewValidator} from "../../interfaces/review/IReviewValidator.js";
import {ReviewPaginationResultDTO, PaginationMetadata} from "../../domain/index.js";

import {EntityNotFoundError} from "../../errors/index.js";

/**
 * Agnostic business logic layer for review operations.
 * Coordinates between the Review Repository, Product Service, and User Service.
 * @augments IReviewService
 */
export class ReviewService extends IReviewService {
	/** @type {IReviewRepository} */ #reviewRepository;
	/** @type {IUserService} */ #userService;
	/** @type {IProductStatsService} */ #productStatsService;
	/** @type {IReviewValidator} */ #reviewValidator;
	/** @type {IReviewMapper} */ #reviewMapper;

	/**
	 * @param {IReviewRepository} reviewRepository
	 * @param {IUserService} userService
	 * @param {IProductStatsService} productStatsService
	 * @param {IReviewValidator} reviewValidator
	 * @param {IReviewMapper} reviewMapper
	 */
	constructor(reviewRepository, userService, productStatsService, reviewValidator, reviewMapper) {
		super();
		this.#reviewRepository = reviewRepository;
		this.#userService = userService;
		this.#productStatsService = productStatsService;
		this.#reviewValidator = reviewValidator;
		this.#reviewMapper = reviewMapper;
	}

	async #formReviewDTO(entity) {
		const shortUserDTO = await this.#userService.getShortDTOById(entity.userId);
		return this.#reviewMapper.toDTO(entity, shortUserDTO);
	}

	async #formReviewDTOs(entities) {
		const uniqueUserIds = [
			...new Set(entities.map(entity => entity.userId).filter(Boolean))
		];
		const shortUserDTOs = await this.#userService.getShortDTOsByIds(uniqueUserIds);
		const userMap = new Map(shortUserDTOs.map(dto => [dto.id, dto]));

		return entities.map(entity => {
			const shortUserDTO = userMap.get(entity.userId);
			return this.#reviewMapper.toDTO(entity, shortUserDTO);
		});
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
			throw new EntityNotFoundError("Review", { reviewId, userId });
		}
		return existingReview;
	}

	async create(productId, userId, data) {
		await this.#reviewValidator.validateCreation(productId, userId);

		const createdReview = await this.#reviewRepository.create(productId, userId, data.toPersistence());

		try {
			await this.#productStatsService.handleReviewCreation(
				createdReview.productId,
				createdReview.rating
			);
		}
		catch (error) {
			// Could be passed to Event Bus (RabbitMQ/Kafka) for eventual consistency
			console.error("Failed to update product stats after review creation:", error);
		}

		return await this.#formReviewDTO(createdReview);
	}

	async update(reviewId, userId, data) {
		const existingReview = await this.#getReviewOrFail(reviewId, userId);
		const oldRating = existingReview.rating;

		const updatedReview = await this.#reviewRepository.updateByIdAndUserId(
			reviewId, userId, data.toPersistence()
		);

		const newRating = updatedReview.rating;

		if (data.rating !== undefined && data.rating !== oldRating) {
			try {
				await this.#productStatsService.handleReviewUpdate(
					updatedReview.productId,
					newRating,
					oldRating
				);
			}
			catch (error) {
				// Could be passed to Event Bus (RabbitMQ/Kafka) for eventual consistency
				console.error("Failed to update product stats:", error);
			}
		}

		return await this.#formReviewDTO(updatedReview);
	}

	async delete(userId, reviewId) {
		const deletedReview = await this.#reviewRepository.deleteByIdAndUserId(reviewId, userId);

		await this.#productStatsService.handleReviewDeletion(
			deletedReview.productId,
			deletedReview.rating
		);

		return await this.#formReviewDTO(deletedReview);
	}

	async getAllByProduct(productId, page = 1, limit = 10) {
		await this.#reviewValidator.validateProductExistence(productId);

		const skip = (page - 1) * limit;

		const { results, total } = await this.#reviewRepository.findAndCountByProduct(productId, skip, limit);

		const pages = Math.ceil(total / limit);
		const reviewDTOs = await this.#formReviewDTOs(results);

		return new ReviewPaginationResultDTO(
			reviewDTOs,
			new PaginationMetadata(page, limit, total, pages)
		);
	}
}