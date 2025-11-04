import {IProductService} from "../../interfaces/product/IProductService.js";
import {IProductStatsService} from "../../interfaces/product/IProductStatsService.js";

/**
 * Concrete implementation of IProductStatsService.
 * Its sole responsibility is the Product Statistics Workflow: translating review actions
 * into the required low-level updates on the Product entity's aggregated stats.
 * @augments IProductStatsService
 */
export class ProductStatsService extends IProductStatsService {
	/** @type {IProductService} */ #productService;

	/**
	 * @param {IProductService} productService
	 */
	constructor(productService) {
		super();
		this.#productService = productService;
	}

	async handleReviewCreation(productId, newRating) {
		// New Review: +1 total review count, rating change is the new rating, old rating is 0
		await this.#productService.updateRatingStats(
			productId,
			newRating,
			1, // totalReviewsChange (+1)
			0  // oldRating (0 for create)
		);
	}

	async handleReviewUpdate(productId, newRating, oldRating) {
		// Only update stats if the rating actually changed
		if (newRating !== oldRating) {
			// Updated Review: 0 change in total review count. New rating and old rating are used to calculate the net sum change.
			await this.#productService.updateRatingStats(
				productId,
				newRating,
				0, // totalReviewsChange (0 for update)
				oldRating // oldRating (previous rating for subtraction/re-averaging)
			);
		}
	}

	async handleReviewDeletion(productId, oldRating) {
		// Deleted Review: -1 total review count. The old rating is passed to be subtracted from the rating sum.
		await this.#productService.updateRatingStats(
			productId,
			0, // ratingChange (0, as the rating logic uses oldRating for subtraction)
			-1, // totalReviewsChange (-1)
			oldRating // oldRating (the rating to subtract from ratingSum)
		);
	}
}