import {IReviewValidator} from "../../interfaces/review/IReviewValidator.js";
import {IProductRepository} from "../../interfaces/repositories/IProductRepository.js";
import {IUserRepository} from "../../interfaces/repositories/IUserRepository.js";
import {IReviewRepository} from "../../interfaces/repositories/IReviewRepository.js";
import {IOrderRepository} from "../../interfaces/repositories/IOrderRepository.js";

import {DomainValidationError, EntityNotFoundError} from "../../errors/index.js";

/**
 * @augments IReviewValidator
 * @description Concrete implementation of IReviewValidator.
 */
export class ReviewValidator extends IReviewValidator {
	/** @type {IProductRepository} */ #productRepository;
	/** @type {IUserRepository} */ #userRepository;
	/** @type {IReviewRepository} */ #reviewRepository;
	/** @type {IOrderRepository} */ #orderRepository;

	/**
	 * @param {IProductRepository} productRepository
	 * @param {IUserRepository} userRepository
	 * @param {IReviewRepository} reviewRepository
	 * @param {IOrderRepository} orderRepository
	 */
	constructor(productRepository, userRepository, reviewRepository, orderRepository) {
		super();
		this.#productRepository = productRepository;
		this.#userRepository = userRepository;
		this.#reviewRepository = reviewRepository;
		this.#orderRepository = orderRepository;
	}

	async validateCreation(productId, userId) {
		const [productExists, userExists] = await Promise.all([
			this.#productRepository.exists(productId),
			this.#userRepository.exists(userId)
		]);

		if (!productExists) throw new EntityNotFoundError("Product", { productId });
		if (!userExists) throw new EntityNotFoundError("User", { userId });

		const alreadyReviewed = await this.#reviewRepository.existsByProductAndUser(productId, userId);
		if (alreadyReviewed) {
			throw new DomainValidationError("You have already reviewed this product.");
		}

		const hasPurchased = await this.#orderRepository.hasUserPurchasedProduct(userId, productId);
		if (!hasPurchased) {
			throw new DomainValidationError("You can only review products you have purchased.");
		}
	}
}