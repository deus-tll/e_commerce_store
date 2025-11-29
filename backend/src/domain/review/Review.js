import {ShortUserDTO, PaginationMetadata} from "../index.js";

/**
 * Agnostic class representing the core Review Entity, used by the Repository layer.
 * All relationships (product, user) are represented by string IDs.
 */
export class ReviewEntity {
	/** @type {string} */ id;
	/** @type {string} */ productId;
	/** @type {string} */ userId;
	/** @type {number} */ rating;
	/** @type {string} */ comment;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {object} data - Plain data object with standardized 'id' field.
	 */
	constructor(data) {
		this.id = data.id.toString();
		this.productId = data.id.toString();
		this.userId = data.userId.toString();
		this.rating = data.rating;
		this.comment = data.comment;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}
}

/**
 * Agnostic class for input data when creating a Review.
 */
export class CreateReviewDTO {
	/** @type {string} */ productId;
	/** @type {string} */ userId;
	/** @type {number} */ rating;
	/** @type {string} */ comment;

	/**
	 * @param {object} data - Raw data for creation.
	 */
	constructor(data) {
		this.productId = data.id;
		this.userId = data.userId;
		this.rating = data.rating;
		this.comment = data.comment;
	}
}

/**
 * Agnostic class for input data when updating a review.
 */
export class UpdateReviewDTO {
	/** @type {string} */ reviewId;
	/** @type {string} */ userId;
	/** @type {number} [rating] */ rating;
	/** @type {string} [comment] */ comment;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.reviewId = data.reviewId;
		this.userId = data.userId;
		if (data.rating !== undefined) this.rating = data.rating;
		if (data.comment !== undefined) this.comment = data.comment;
	}

	/**
	 * Returns an object containing only the fields that were explicitly
	 * provided by the caller for update.
	 * This object can be used by the persistence layer to perform a partial update.
	 * Excludes fields used for identifying the review (reviewId, userId).
	 * @returns {object} An object with only the fields to be updated.
	 */
	toUpdateObject() {
		const update = {};

		if (this.rating !== undefined) {
			update.rating = this.rating;
		}

		if (this.comment !== undefined) {
			update.comment = this.comment;
		}

		return update;
	}
}

/**
 * Data Transfer Object for a Review, used by the Service layer.
 */
export class ReviewDTO {
	/** @type {string} */ id;
	/** @type {string} */ productId;
	/** @type {ShortUserDTO | null} */ user;
	/** @type {number} */ rating;
	/** @type {string} */ comment;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {ReviewEntity} entity
	 * @param {ShortUserDTO} userShortDTO
	 */
	constructor(entity, userShortDTO) {
		this.id = entity.id;
		this.productId = entity.productId;
		this.user = userShortDTO;
		this.rating = entity.rating;
		this.comment = entity.comment;
		this.createdAt = entity.createdAt;
		this.updatedAt = entity.updatedAt;
	}
}

/**
 * Service-level pagination result DTO.
 */
export class ReviewPaginationResultDTO {
	/** @type {ReviewDTO[]} */ reviews;
	/** @type {PaginationMetadata} */ pagination;

	/**
	 * @param {ReviewDTO[]} reviews
	 * @param {PaginationMetadata} pagination
	 */
	constructor(reviews, pagination) {
		this.reviews = reviews;
		this.pagination = pagination;
	}
}