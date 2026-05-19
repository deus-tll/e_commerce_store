import {IReviewValidator} from "../../interfaces/review/IReviewValidator.js";
import {IProductRepository} from "../product/IProductRepository.js";
import {IUserRepository} from "../user/IUserRepository.js";
import {IReviewRepository} from "./IReviewRepository.js";
import {IOrderRepository} from "../order/IOrderRepository.js";

import {DomainValidationError, EntityNotFoundError} from "../../errors/index.ts";

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

		// Commenting this out to allow seeder to add reviews
		//
		// const hasPurchased = await this.#orderRepository.hasUserPurchasedProduct(userId, productId);
		// if (!hasPurchased) {
		// 	throw new DomainValidationError("You can only review products you have purchased.");
		// }
	}
}