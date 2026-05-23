import {IProductRepository} from "./IProductRepository.js";

/**
 * Responsible for the Product Statistics Workflow: translating review actions
 * into the required low-level updates on the Product entity's aggregated stats.
 */
export class ProductStatsService{
	private readonly productRepository: IProductRepository;

	constructor(productRepository: IProductRepository) {
		this.productRepository = productRepository;
	}

	async handleReviewCreation(productId: string, newRating: number): Promise<void> {
		// New Review: +1 total review count, rating change is the new rating, old rating is 0
		await this.productRepository.updateRatingStats(
			productId,
			newRating,
			1, // totalReviewsChange (+1)
			0  // oldRating (0 for create)
		);
	}

	async handleReviewUpdate(productId: string, newRating: number, oldRating: number): Promise<void> {
		// Only update stats if the rating actually changed
		if (newRating !== oldRating) {
			// Updated Review: 0 change in total review count. New rating and old rating are used to calculate the net sum change.
			await this.productRepository.updateRatingStats(
				productId,
				newRating,
				0, // totalReviewsChange (0 for update)
				oldRating // oldRating (previous rating for subtraction/re-averaging)
			);
		}
	}

	async handleReviewDeletion(productId: string, oldRating: number): Promise<void> {
		// Deleted Review: -1 total review count. The old rating is passed to be subtracted from the rating sum.
		await this.productRepository.updateRatingStats(
			productId,
			0, // ratingChange (0, as the rating logic uses oldRating for subtraction)
			-1, // totalReviewsChange (-1)
			oldRating // oldRating (the rating to subtract from ratingSum)
		);
	}
}