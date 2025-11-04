import {PaginationMetadata} from "../index.js";

/**
 * Agnostic class representing the core Category Entity, used by the Repository layer.
 */
export class CategoryEntity {
	/** @type {string} */ id;
	/** @type {string} */ name;
	/** @type {string} */ slug;
	/** @type {string} [image] */ image;
	/** @type {Date} */ createdAt;
	/** @type {Date} */ updatedAt;

	/**
	 * @param {object} data - Plain data object with standardized 'id' field.
	 */
	constructor(data) {
		this.id = data.id.toString();
		this.name = data.name;
		this.slug = data.slug;
		this.image = data.image || "";
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;
	}
}

/**
 * Agnostic class for input data when creating a Category.
 */
export class CreateCategoryDTO {
	/** @type {string} */ name;
	/** @type {string} [slug] */ slug;
	/** @type {string} */ image;

	/**
	 * @param {object} data - Raw data for creation.
	 */
	constructor(data) {
		this.name = data.name;
		this.slug = data.slug;
		this.image = data.image || "";
	}
}

/**
 * Agnostic class for input data when updating a category.
 */
export class UpdateCategoryDTO {
	/** @type {string} */ categoryId;
	/** @type {string} [name] */ name;
	/** @type {string} [slug] */ slug;
	/** @type {string} [image] */ image;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.categoryId = data.categoryId;
		if (data.name !== undefined) this.name = data.name;
		if (data.slug !== undefined) this.slug = data.slug;
		if (data.image !== undefined) this.image = data.image;
	}

	/**
	 * Returns an object containing only the fields that were explicitly
	 * provided by the caller for update.
	 * @returns {object} An object with only the fields to be updated.
	 */
	toUpdateObject() {
		const update = {};

		if (this.name !== undefined) {
			update.name = this.name;
		}

		if (this.slug !== undefined) {
			update.slug = this.slug;
		}

		if (this.image !== undefined) {
			update.image = this.image;
		}

		return update;
	}
}

/**
 * Represents the public facing Category data structure (DTO).
 * This is the object returned by the Service layer.
 */
export class CategoryDTO {
	/** @type {string} */ id;
	/** @type {string} */ name;
	/** @type {string} */ slug;
	/** @type {string} */ image;

	/**
	 * @param {CategoryEntity} entity
	 */
	constructor(entity) {
		this.id = entity.id;
		this.name = entity.name;
		this.slug = entity.slug;
		this.image = entity.image;
	}
}

/**
 * Service-level pagination result DTO for categories.
 */
export class CategoryPaginationResultDTO {
	/** @type {CategoryDTO[]} */ categories;
	/** @type {PaginationMetadata} */ pagination;

	/**
	 * @param {CategoryDTO[]} categories
	 * @param {PaginationMetadata} pagination
	 */
	constructor(categories, pagination) {
		this.categories = categories;
		this.pagination = pagination;
	}
}