import {IProductRepository} from "../product/IProductRepository.js";
import {IUserRepository} from "../user/IUserRepository.js";
import {IReviewRepository} from "./IReviewRepository.js";
import {IOrderRepository} from "../order/IOrderRepository.js";

import {ValidationError, EntityNotFoundError} from "../../errors/index.js";

export class ReviewValidator {
	constructor(
		private readonly productRepository: IProductRepository,
		private readonly userRepository: IUserRepository,
		private readonly reviewRepository: IReviewRepository,
		private readonly orderRepository: IOrderRepository,
		private readonly requirePurchaseForReview: boolean
	) {}

	async validateCreation(productId: string, userId: string): Promise<void> {
		const [productExists, userExists] = await Promise.all([
			this.productRepository.exists(productId),
			this.userRepository.exists(userId)
		]);

		if (!productExists) throw new EntityNotFoundError("Product", { productId });
		if (!userExists) throw new EntityNotFoundError("User", { userId });

		const alreadyReviewed = await this.reviewRepository.existsByProductAndUser(productId, userId);
		if (alreadyReviewed) {
			throw new ValidationError("You have already reviewed this product.");
		}

		if (this.requirePurchaseForReview) {
			const hasPurchased = await this.orderRepository.hasUserPurchasedProduct(userId, productId);
			if (!hasPurchased) {
				throw new ValidationError("You can only review products you have purchased.");
			}
		}
		else {
			console.warn('[ReviewValidator] Purchase check is disabled.');
		}
	}
}