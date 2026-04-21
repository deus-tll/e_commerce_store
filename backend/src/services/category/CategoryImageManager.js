import {ICategoryImageManager} from "../../interfaces/category/ICategoryImageManager.js";
import {ICategoryStorageService} from "../../interfaces/storage/ICategoryStorageService.js";

import {DomainValidationError} from "../../errors/index.js";

/**
 * @augments ICategoryImageManager
 * @description Service to manage image update workflow for the Category domain.
 */
export class CategoryImageManager extends ICategoryImageManager {
	/** @type {ICategoryStorageService} */ #categoryStorageService;

	/**
	 * @param {ICategoryStorageService} categoryStorageService
	 */
	constructor(categoryStorageService) {
		super();
		this.#categoryStorageService = categoryStorageService;
	}

	async handleImageUpdate(newImageValue, oldImageValue) {
		if (!newImageValue) {
			throw new DomainValidationError("Category image is required and cannot be empty.");
		}

		const isString = typeof newImageValue === "string";

		if (isString && newImageValue !== oldImageValue) {
			const finalImageUrl = await this.#categoryStorageService.upload(newImageValue);
			if (oldImageValue) await this.#categoryStorageService.delete(oldImageValue);

			return finalImageUrl;
		}

		return oldImageValue;
	}

	async deleteImage(imageUrl) {
		return this.#categoryStorageService.delete(imageUrl);
	}
}