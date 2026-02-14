import {CategoryDTO, PaginationMetadata} from "../index.js";

/**
 * Agnostic class for product attributes (specifications).
 */
export class ProductAttribute {
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ value;

	constructor({ name, value }) {
		this.name = name;
		this.value = value;

		Object.freeze(this);
	}
}

/**
 * Agnostic class for nested product image data.
 * Used for both Entity and DTO layers.
 */
export class ProductImage {
	/** @type {string} @readonly */ mainImage;
	/** @type {string[]} @readonly */ additionalImages;

	/**
	 * @param {object} data
	 * @param {string} data.mainImage - URL for the main image.
	 * @param {string[]} [data.additionalImages] - Array of URLs for additional images.
	 */
	constructor({ mainImage, additionalImages }) {
		this.mainImage = mainImage;
		this.additionalImages = Object.freeze([...(additionalImages || [])]);

		Object.freeze(this);
	}
}

/**
 * Agnostic class for nested product rating data.
 * Used for both Entity and DTO layers.
 */
export class ProductRatingStats {
	/** @type {number} @readonly */ averageRating;
	/** @type {number} @readonly */ totalReviews;
	/** @type {number} @readonly */ ratingSum;

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

		Object.freeze(this);
	}
}

/**
 * Agnostic class representing the core Product Entity, used by the Repository layer.
 * All complex relationships are represented by string IDs.
 */
export class ProductEntity {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ description;
	/** @type {number} @readonly */ price;
	/** @type {number} @readonly */ stock;
	/** @type {ProductImage} @readonly */ images;
	/** @type {string} @readonly */ categoryId;
	/** @type {ProductAttribute[]} @readonly */ attributes;
	/** @type {boolean} @readonly */ isFeatured;
	/** @type {ProductRatingStats} @readonly */ ratingStats;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id;
		this.name = data.name;
		this.description = data.description;
		this.price = data.price;
		this.stock = data.stock;
		this.images = data.images;
		this.categoryId = data.categoryId;
		this.attributes = Object.freeze([...data.attributes]);
		this.isFeatured = data.isFeatured;
		this.ratingStats = data.ratingStats;
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		Object.freeze(this);
	}
}

/**
 * Agnostic class for creating a new Product.
 */
export class CreateProductDTO {
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ description;
	/** @type {number} @readonly */ price;
	/** @type {number} @readonly */ stock;
	/** @type {ProductImage} @readonly */ images;
	/** @type {string} @readonly */ categoryId;
	/** @type {ProductAttribute[]} @readonly */ attributes;
	/** @type {boolean} @readonly */ isFeatured;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.name = data.name;
		this.description = data.description;
		this.price = data.price;
		this.stock = data.stock;
		this.images = data.images;
		this.categoryId = data.categoryId;
		this.attributes = Object.freeze([...data.attributes]);
		this.isFeatured = !!data.isFeatured;

		Object.freeze(this);
	}

	/**
	 * Transforms the DTO into a clean object for the Repository.
	 * @returns {Object}
	 */
	toPersistence() {
		return Object.freeze({
			name: this.name,
			description: this.description,
			price: this.price,
			stock: this.stock,
			categoryId: this.categoryId,
			isFeatured: this.isFeatured,
		});
	}
}

/**
 * Agnostic class for input data when updating a product.
 */
export class UpdateProductDTO {
	/** @type {string} [name] @readonly */ name;
	/** @type {string} [description] @readonly */ description;
	/** @type {number} [price] @readonly */ price;
	/** @type {number} [stock] @readonly */ stock;
	/** @type {ProductImage} [images] @readonly */ images;
	/** @type {string} [categoryId] @readonly */ categoryId;
	/** @type {ProductAttribute[]} [attributes] @readonly */ attributes;
	/** @type {boolean} [isFeatured] @readonly */ isFeatured;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		if (data.name !== undefined) this.name = data.name;
		if (data.description !== undefined) this.description = data.description;
		if (data.price !== undefined) this.price = data.price;
		if (data.stock !== undefined) this.stock = data.stock;
		if (data.images !== undefined) this.images = data.images;
		if (data.categoryId !== undefined) this.categoryId = data.categoryId;
		if (data.attributes !== undefined) this.attributes = Object.freeze([...data.attributes]);
		if (data.isFeatured !== undefined) this.isFeatured = data.isFeatured;

		Object.freeze(this);
	}

	/**
	 * Transforms the DTO into a clean object for the Repository.
	 * @returns {Object}
	 */
	toPersistence() {
		const data = {};

		if (this.name !== undefined) data.name = this.name;
		if (this.description !== undefined) data.description = this.description;
		if (this.price !== undefined) data.price = this.price;
		if (this.stock !== undefined) data.stock = this.stock;
		if (this.categoryId !== undefined) data.categoryId = this.categoryId;
		if (this.isFeatured !== undefined) data.isFeatured = this.isFeatured;

		return Object.freeze(data);
	}
}

/**
 * Agnostic class for Product Data Transfer Object, used by the Service layer outwards.
 * This class includes the fully populated CategoryDTO.
 */
export class ProductDTO {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ description;
	/** @type {number} @readonly */ price;
	/** @type {number} @readonly */ stock;
	/** @type {ProductImage} @readonly */ images;
	/** @type {CategoryDTO} @readonly */ category;
	/** @type {ProductAttribute[]} @readonly */ attributes;
	/** @type {boolean} @readonly */ isFeatured;
	/** @type {ProductRatingStats} @readonly */ ratingStats;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/**
	 * @param {ProductEntity} entity
	 * @param {CategoryDTO} categoryDTO
	 */
	constructor(entity, categoryDTO) {
		this.id = entity.id;
		this.name = entity.name;
		this.description = entity.description;
		this.price = entity.price;
		this.stock = entity.stock;
		this.images = entity.images;
		this.category = categoryDTO;
		this.attributes = Object.freeze([...entity.attributes]);
		this.isFeatured = entity.isFeatured;
		this.ratingStats = entity.ratingStats;
		this.createdAt = entity.createdAt;
		this.updatedAt = entity.updatedAt;

		Object.freeze(this);
	}
}

/**
 * Agnostic class for a basic Product Data Transfer Object, used in arrays/embedded objects
 * where full category/description data is not needed (e.g., Cart items, Order items).
 */
export class ShortProductDTO {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ name;
	/** @type {number} @readonly */ price;
	/** @type {number} @readonly */ stock;
	/** @type {string} @readonly */ image;

	/**
	 * @param {ProductEntity} entity
	 */
	constructor(entity) {
		this.id = entity.id;
		this.name = entity.name;
		this.price = entity.price;
		this.stock = entity.stock;
		this.image = entity.images?.mainImage || "";

		Object.freeze(this);
	}
}

/**
 * Service-level pagination result DTO.
 */
export class ProductPaginationResultDTO {
	/** @type {ProductDTO[]} @readonly */ products;
	/** @type {PaginationMetadata} @readonly */ pagination;

	/**
	 * @param {ProductDTO[]} products
	 * @param {PaginationMetadata} pagination
	 */
	constructor(products, pagination) {
		this.products = Object.freeze([...products]);
		this.pagination = pagination;

		Object.freeze(this);
	}
}

/**
 * DTO representing a set of unique values for a specific product attribute.
 * Used for building dynamic filter sidebars.
 */
export class AttributeFacetDTO {
	/** @type {string} @readonly */ name;
	/** @type {string[]} @readonly */ values;

	/**
	 * @param {string} name - The name of the attribute (e.g., "RAM").
	 * @param {string[]} values - List of unique values (e.g., ["8GB", "16GB"]).
	 */
	constructor(name, values) {
		this.name = name;
		this.values = Object.freeze([...values]);

		Object.freeze(this);
	}
}