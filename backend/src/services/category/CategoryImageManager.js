import {ICategoryImageManager} from "../../interfaces/category/ICategoryImageManager.js";
import {CategoryStorageManager} from "../../core/storage/CategoryStorageManager.js";
import {DomainValidationError} from "../../errors/index.js";

/**
 * @augments ICategoryImageManager
 * @description Domain manager for Category image workflow.
 */
export class CategoryImageManager extends ICategoryImageManager {
	/** @type {CategoryStorageManager} */ #categoryStorageManager;

	/**
	 * @param {CategoryStorageManager} categoryStorageManager
	 */
	constructor(categoryStorageManager) {
		super();
		this.#categoryStorageManager = categoryStorageManager;
	}

	#validatePresence(value) {
		if (!value) {
			throw new DomainValidationError("Category image is required.");
		}
	}

	async imageDataUploadOnCreateUpdate(newImageData, existingImageData) {
		this.#validatePresence(newImageData);

		if (newImageData === existingImageData) return existingImageData;
		const finalImageUrl = await this.#categoryStorageManager.upload(newImageData);
		if (existingImageData) await this.#categoryStorageManager.delete(existingImageData);

		return finalImageUrl;
	}

	async deleteByUrl(url) {
		return this.#categoryStorageManager.delete(url);
	}
}