import {ShortUserDTO, PaginationMetadata} from "../index.js";

/**
 * Agnostic class representing the core Review Entity, used by the Repository layer.
 * All relationships (product, user) are represented by string IDs.
 */
export class ReviewEntity {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ productId;
	/** @type {string} @readonly */ userId;
	/** @type {number} @readonly */ rating;
	/** @type {string} @readonly */ comment;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id;
		this.productId = data.productId;
		this.userId = data.userId;
		this.rating = data.rating;
		this.comment = data.comment;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		Object.freeze(this);
	}
}

/**
 * Agnostic class for input data when creating a Review.
 */
export class CreateReviewDTO {
	/** @type {string} @readonly */ productId;
	/** @type {string} @readonly */ userId;
	/** @type {number} @readonly */ rating;
	/** @type {string} @readonly */ comment;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.productId = data.productId;
		this.userId = data.userId;
		this.rating = data.rating;
		this.comment = data.comment;

		Object.freeze(this);
	}

	/**
	 * Transforms the DTO into a clean object for the Repository.
	 * @returns {Object}
	 */
	toPersistence() {
		return Object.freeze({
			productId: this.productId,
			userId: this.userId,
			rating: this.rating,
			comment: this.comment
		});
	}
}

/**
 * Agnostic class for input data when updating a review.
 */
export class UpdateReviewDTO {
	/** @type {number} [rating] @readonly */ rating;
	/** @type {string} [comment] @readonly */ comment;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		if (data.rating !== undefined) this.rating = data.rating;
		if (data.comment !== undefined) this.comment = data.comment;

		Object.freeze(this);
	}

	/**
	 * Creates a plain object containing only the fields that were provided for the update.
	 * @returns {object}
	 */
	toPersistence() {
		const data = {};

		if (this.rating !== undefined) data.rating = this.rating;
		if (this.comment !== undefined) data.comment = this.comment;

		return Object.freeze(data);
	}
}

/**
 * Data Transfer Object for a Review, used by the Service layer.
 */
export class ReviewDTO {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ productId;
	/** @type {ShortUserDTO | null} @readonly */ user;
	/** @type {number} @readonly */ rating;
	/** @type {string} @readonly */ comment;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

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

		Object.freeze(this);
	}
}

/**
 * Service-level pagination result DTO.
 */
export class ReviewPaginationResultDTO {
	/** @type {ReviewDTO[]} @readonly */ reviews;
	/** @type {PaginationMetadata} @readonly */ pagination;

	/**
	 * @param {ReviewDTO[]} reviews
	 * @param {PaginationMetadata} pagination
	 */
	constructor(reviews, pagination) {
		this.reviews = Object.freeze([...reviews]);
		this.pagination = pagination;

		Object.freeze(this);
	}
}