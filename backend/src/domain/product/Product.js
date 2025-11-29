import {CategoryDTO, PaginationMetadata} from "../index.js";

/**
 * Agnostic class for nested product image data.
 * Used for both Entity and DTO layers.
 */
export class ProductImage {
	/** @type {string} */ mainImage;
	/** @type {string[]} */ additionalImages;

	/**
	 * @param {object} data
	 * @param {string} data.mainImage - URL for the main image.
	 * @param {string[]} [data.additionalImages] - Array of URLs for additional images.
	 */
	constructor({ mainImage, additionalImages }) {
		this.mainImage = mainImage;
		this.additionalImages = additionalImages || [];
	}
}

/**
 * Agnostic class for nested product rating data.
 * Used for both Entity and DTO layers.
 */
export class ProductRatingStats {
	/** @type {number} */ averageRating;
	/** @type {number} */ totalReviews;
	/** @type {number} */ ratingSum;

	/**
	 * @param {object} data
	 * @param {number} [data.averageRating=0]
	 * @param {number} [data.totalReviews=0]
	 * @param {number} [data.ratingSum=0]
	 */
	constructor(data = {}) {
		this.averageRating = data.averageRating || 0;
		this.totalReviews = data.totalReviews || 0;
		this.ratingSum = data.ratingSum || 0;
	}
}

/**
 * Agnostic class representing the core Product Entity, used by the Repository layer.
 * All complex relationships are represented by string IDs.
 */
export class ProductEntity {
	/** @type {string} */ id;
	/** @type {string} */ name;
	/** @type {string} */ description;
	/** @type {number} */ price;
	/** @type {ProductImage} */ images;
	/** @type {string} */ categoryId;
	/** @type {boolean} */ isFeatured;
	/** @type {ProductRatingStats} */ ratingStats;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor({ id, name, description, price, images, categoryId, isFeatured, ratingStats, createdAt, updatedAt }) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.images = new ProductImage(images);
		this.categoryId = categoryId;
		this.isFeatured = isFeatured;
		this.ratingStats = new ProductRatingStats(ratingStats);
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
}

/**
 * Agnostic class for creating a new Product.
 */
export class CreateProductDTO {
	/** @type {string} */ name;
	/** @type {string} */ description;
	/** @type {number} */ price;
	/** @type {ProductImage | null} */ images;
	/** @type {string} */ categoryId;
	/** @type {boolean} */ isFeatured;

	/**
	 * @param {object} data
	 */
	constructor({ name, description, price, images, categoryId, isFeatured }) {
		this.name = name;
		this.description = description;
		this.price = price;
		this.images = images ? new ProductImage(images) : null;
		this.categoryId = categoryId;
		this.isFeatured = !!isFeatured;
	}
}

/**
 * Agnostic class for input data when updating a product.
 */
export class UpdateProductDTO {
	/** @type {string} [name] */ name;
	/** @type {string} [description] */ description;
	/** @type {number} [price] */ price;
	/** @type {object} [images] */ images;
	/** @type {string} [categoryId] */ categoryId;
	/** @type {boolean} [isFeatured] */ isFeatured;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		if (data.name !== undefined) this.name = data.name;
		if (data.description !== undefined) this.description = data.description;
		if (data.price !== undefined) this.price = data.price;
		if (data.images !== undefined) this.images = data.images;
		if (data.categoryId !== undefined) this.categoryId = data.categoryId;
		if (data.isFeatured !== undefined) this.isFeatured = data.isFeatured;
	}

	/**
	 * Returns an object containing only the fields that were explicitly
	 * provided by the caller for update.
	 * @returns {object} An object with only the fields to be updated.
	 */
	toUpdateObject() {
		const update = {};

		if (this.name !== undefined) update.name = this.name;
		if (this.description !== undefined) update.description = this.description;
		if (this.price !== undefined) update.price = this.price;
		if (this.images !== undefined) update.images = this.images;
		if (this.categoryId !== undefined) update.categoryId = this.categoryId;
		if (this.isFeatured !== undefined) update.isFeatured = this.isFeatured;

		return update;
	}
}

/**
 * Agnostic class for Product Data Transfer Object, used by the Service layer outwards.
 * This class includes the fully populated CategoryDTO.
 */
export class ProductDTO {
	/** @type {string} */ id;
	/** @type {string} */ name;
	/** @type {string} */ description;
	/** @type {number} */ price;
	/** @type {ProductImage} */ images;
	/** @type {CategoryDTO} */ category;
	/** @type {boolean} */ isFeatured;
	/** @type {ProductRatingStats} */ ratingStats;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {ProductEntity} entity - The core product entity (contains ID and primitive fields).
	 * @param {CategoryDTO} categoryDTO - The fully resolved and mapped Category DTO.
	 */
	constructor(entity, categoryDTO) {
		this.id = entity.id;
		this.name = entity.name;
		this.description = entity.description;
		this.price = entity.price;
		this.images = entity.images;
		this.category = categoryDTO;
		this.isFeatured = entity.isFeatured;
		this.ratingStats = entity.ratingStats;
		this.createdAt = entity.createdAt;
		this.updatedAt = entity.updatedAt;
	}
}

/**
 * Agnostic class for a basic Product Data Transfer Object, used in arrays/embedded objects
 * where full category/description data is not needed (e.g., Cart items, Order items).
 */
export class ShortProductDTO {
	/** @type {string} */ id;
	/** @type {string} */ name;
	/** @type {number} */ price;
	/** @type {string} */ image;

	/**
	 * @param {ProductEntity} entity
	 */
	constructor(entity) {
		this.id = entity.id;
		this.name = entity.name;
		this.price = entity.price;
		this.image = entity.images?.mainImage || "";
	}
}

/**
 * Service-level pagination result DTO.
 */
export class ProductPaginationResultDTO {
	/** @type {ProductDTO[]} */ products;
	/** @type {PaginationMetadata} */ pagination;

	/**
	 * @param {ProductDTO[]} products
	 * @param {PaginationMetadata} pagination
	 */
	constructor(products, pagination) {
		this.products = products;
		this.pagination = pagination;
	}
}