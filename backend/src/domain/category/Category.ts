import {PaginationMetadata} from "../index.js";

/**
 * Represents a Category domain entity.
 */
export class CategoryEntity {
	public readonly id: string;
	public readonly name: string;
	public readonly slug: string;
	public readonly image: string;
	public readonly allowedAttributes: readonly string[];
	public readonly createdAt: Date;
	public readonly updatedAt: Date;

	constructor(data: { id: string; name: string; slug: string; image: string; allowedAttributes: string[]; createdAt: Date; updatedAt: Date; }) {
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

export type CreateCategoryPersistence = Pick<CategoryEntity, "name" | "slug" | "image" | "allowedAttributes">;

/**
 * Represents input data for Category creation.
 */
export class CreateCategoryDTO {
	public readonly name: string;
	public readonly image: string;
	public readonly allowedAttributes: readonly string[];

	constructor(data: { name: string; image: string; allowedAttributes: readonly string[] }) {
		this.name = data.name;
		this.image = data.image;
		this.allowedAttributes = Object.freeze([...data.allowedAttributes]);
		Object.freeze(this);
	}
}

export type UpdateCategoryPersistence = Partial<Pick<CategoryEntity, "name" | "slug" | "image" | "allowedAttributes">>;

/**
 * Represents input data for Category update.
 */
export class UpdateCategoryDTO {
	public readonly name?: string;
	public readonly slug?: string;
	public readonly image?: string;
	public readonly allowedAttributes?: readonly string[];

	constructor(data: { name?: string; slug?: string; image?: string; allowedAttributes?: readonly string[]; }) {
		if (data.name !== undefined) this.name = data.name;
		if (data.slug !== undefined) this.slug = data.slug;
		if (data.image !== undefined) this.image = data.image;
		if (data.allowedAttributes !== undefined) this.allowedAttributes = Object.freeze([...data.allowedAttributes]);

		Object.freeze(this);
	}

	toPersistence(): UpdateCategoryPersistence {
		const data = {
			...(this.name !== undefined && { name: this.name }),
			...(this.slug !== undefined && { slug: this.slug }),
			...(this.image !== undefined && { image: this.image }),
			...(this.allowedAttributes !== undefined && { allowedAttributes: this.allowedAttributes })
		};

		return Object.freeze(data) as UpdateCategoryPersistence;
	}
}

/**
 * Represents the public facing Category data structure.
 */
export class CategoryDTO {
	public readonly id: string;
	public readonly name: string;
	public readonly slug: string;
	public readonly image: string;
	public readonly allowedAttributes: readonly string[];

	constructor(entity: CategoryEntity) {
		this.id = entity.id;
		this.name = entity.name;
		this.slug = entity.slug;
		this.image = entity.image;
		this.allowedAttributes = Object.freeze([...entity.allowedAttributes]);

		Object.freeze(this);
	}
}

/**
 * Pagination result for categories.
 */
export class CategoryPaginationResultDTO {
	public readonly categories: readonly CategoryDTO[];
	public readonly pagination: PaginationMetadata;

	constructor(data: { categories: CategoryDTO[], pagination: PaginationMetadata }) {
		this.categories = Object.freeze([...data.categories]);
		this.pagination = data.pagination;

		Object.freeze(this);
	}
}