import {PaginationMetadata} from "../index.js";

/**
 * Agnostic class representing the core Category Entity, used by the Repository layer.
 */
export class CategoryEntity {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ slug;
	/** @type {string} @readonly */ image;
	/** @type {string[]} @readonly */ allowedAttributes;
	/** @type {Date} @readonly */ createdAt;
	/** @type {Date} @readonly */ updatedAt;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.id = data.id;
		this.name = data.name;
		this.slug = data.slug;
		this.image = data.image;
		this.allowedAttributes = Object.freeze([...data.allowedAttributes]);
		this.createdAt = data.createdAt;
		this.updatedAt = data.updatedAt;

		Object.freeze(this);
	}
}

/**
 * Agnostic class for input data when creating a Category.
 */
export class CreateCategoryDTO {
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ image;
	/** @type {string[]} @readonly */ allowedAttributes;

	/**
	 * @param {object} data
	 */
	constructor(data) {
		this.name = data.name;
		this.image = data.image;
		this.allowedAttributes = Object.freeze([...data.allowedAttributes]);

		Object.freeze(this);
	}

	/**
	 * Transforms the DTO into a clean object for the Repository.
	 * @returns {Object}
	 */
	toPersistence() {
		return Object.freeze({
			name: this.name,
			allowedAttributes: this.allowedAttributes
		});
	}
}

/**
 * Agnostic class for input data when updating a category.
 */
export class UpdateCategoryDTO {
	/** @type {string} [name] @readonly */ name;
	/** @type {string} [slug] @readonly */ slug;
	/** @type {string} [image] @readonly */ image;
	/** @type {string[]} [allowedAttributes] @readonly */ allowedAttributes;

	/**
	 * @param {Object} data
	 */
	constructor(data) {
		if (data.name !== undefined) this.name = data.name;
		if (data.slug !== undefined) this.slug = data.slug;
		if (data.image !== undefined) this.image = data.image;
		if (data.allowedAttributes !== undefined) this.allowedAttributes = Object.freeze([...data.allowedAttributes]);

		Object.freeze(this);
	}

	/**
	 * Creates a plain object containing only the fields that were provided for the update.
	 * @returns {Object}
	 */
	toPersistence() {
		const data = {};

		if (this.name !== undefined) data.name = this.name;
		if (this.slug !== undefined) data.slug = this.slug;
		if (this.image !== undefined) data.image = this.image;
		if (this.allowedAttributes !== undefined) data.allowedAttributes = this.allowedAttributes;

		return Object.freeze(data);
	}
}

/**
 * Represents the public facing Category data structure (DTO).
 * This is the object returned by the Service layer.
 */
export class CategoryDTO {
	/** @type {string} @readonly */ id;
	/** @type {string} @readonly */ name;
	/** @type {string} @readonly */ slug;
	/** @type {string} @readonly */ image;
	/** @type {string[]} @readonly */ allowedAttributes;

	/**
	 * @param {CategoryEntity} entity
	 */
	constructor(entity) {
		this.id = entity.id;
		this.name = entity.name;
		this.slug = entity.slug;
		this.image = entity.image;
		this.allowedAttributes = Object.freeze([...entity.allowedAttributes]);

		Object.freeze(this);
	}
}

/**
 * Service-level pagination result DTO for categories.
 */
export class CategoryPaginationResultDTO {
	/** @type {CategoryDTO[]} @readonly */ categories;
	/** @type {PaginationMetadata} @readonly */ pagination;

	/**
	 * @param {CategoryDTO[]} categories
	 * @param {PaginationMetadata} pagination
	 */
	constructor(categories, pagination) {
		this.categories = categories;
		this.pagination = pagination;

		Object.freeze(this);
	}
}