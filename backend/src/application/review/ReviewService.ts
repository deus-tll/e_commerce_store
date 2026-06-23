import {IReviewRepository} from "./IReviewRepository.js";
import {UserService} from "../user/UserService.js";
import {ProductService} from "../product/ProductService.js";
import {ProductStatsService} from "../product/ProductStatsService.js";
import {ReviewValidator} from "./ReviewValidator.js";
import {ReviewMapper} from "./ReviewMapper.js";

import {ReviewEntity} from "../../entities/review/ReviewEntity.js";
import {
	ReviewCreateInput,
	ReviewDTO,
	ReviewPaginationResultDTO,
	ReviewUpdateInput,
	ReviewUpdatePersistence
} from "../types/review.js";
import {PaginationMetadata} from "../types/shared.js";

import {EntityNotFoundError} from "../../errors/index.js";

export class ReviewService {
	constructor(
		private readonly reviewRepository: IReviewRepository,
		private readonly userService: UserService,
		private readonly productService: ProductService,
		private readonly productStatsService: ProductStatsService,
		private readonly reviewValidator: ReviewValidator
	) {}

	private async formDTO(entity: ReviewEntity): Promise<ReviewDTO> {
		const shortUserDTO = await this.userService.getShortDTOByIdOrFail(entity.userId);
		return ReviewMapper.toDTO(entity, shortUserDTO);
	}

	private async formDTOs(entities: readonly ReviewEntity[]): Promise<ReviewDTO[]> {
		const uniqueUserIds = [
			...new Set(entities.map(entity => entity.userId).filter(Boolean))
		];
		const shortUserDTOs = await this.userService.getShortDTOsByIds(uniqueUserIds);

		return ReviewMapper.toDTOs(entities, shortUserDTOs);
	}

	async getReviewOrFail(reviewId: string, userId: string): Promise<ReviewEntity> {
		const existingEntity = await this.reviewRepository.findByIdAndUserId(reviewId, userId);
		if (!existingEntity) {
			throw new EntityNotFoundError("Review", { reviewId, userId });
		}
		return existingEntity;
	}

	async create(productId: string, userId: string, data: ReviewCreateInput): Promise<ReviewDTO> {
		await this.reviewValidator.validateCreation(productId, userId);

		const createdEntity = await this.reviewRepository.create(productId, userId, data);

		try {
			await this.productStatsService.handleReviewCreation(
				createdEntity.productId,
				createdEntity.rating
			);
		}
		catch (error) {
			// Could be passed to Event Bus (RabbitMQ/Kafka) for eventual consistency
			console.error("Failed to update product stats after review creation:", error);
		}

		return await this.formDTO(createdEntity);
	}

	async update(reviewId: string, userId: string, data: ReviewUpdateInput): Promise<ReviewDTO> {
		const existingEntity = await this.getReviewOrFail(reviewId, userId);
		const oldRating = existingEntity.rating;

		const { rating, comment } = data;

		const persistenceData: ReviewUpdatePersistence = Object.freeze({
			...(rating && { rating }),
			...(comment && { comment }),
		} satisfies ReviewUpdatePersistence);

		const updatedEntity = await this.reviewRepository.updateByIdAndUserId(
			reviewId, userId, persistenceData
		);

		const newRating = updatedEntity.rating;

		if (data.rating !== undefined && data.rating !== oldRating) {
			try {
				await this.productStatsService.handleReviewUpdate(
					updatedEntity.productId,
					newRating,
					oldRating
				);
			}
			catch (error) {
				// Could be passed to Event Bus (RabbitMQ/Kafka) for eventual consistency
				console.error("Failed to update product stats:", error);
			}
		}

		return await this.formDTO(updatedEntity);
	}

	async delete(userId: string, reviewId: string): Promise<ReviewDTO> {
		const deletedEntity = await this.reviewRepository.deleteByIdAndUserId(reviewId, userId);

		await this.productStatsService.handleReviewDeletion(
			deletedEntity.productId,
			deletedEntity.rating
		);

		return await this.formDTO(deletedEntity);
	}

	async getAllByProduct(productId: string, page = 1, limit = 10): Promise<ReviewPaginationResultDTO> {
		await this.productService.getByIdOrFail(productId);

		const skip = (page - 1) * limit;

		const { results, total } = await this.reviewRepository.findAndCountByProduct(productId, skip, limit);

		const pages = Math.ceil(total / limit);
		const dtos = await this.formDTOs(results);

		return new ReviewPaginationResultDTO(
			dtos,
			new PaginationMetadata(page, limit, total, pages)
		);
	}
}