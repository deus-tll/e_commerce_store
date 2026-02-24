import {ICategoryImageManager} from "../../interfaces/category/ICategoryImageManager.js";
import {ICategoryStorageService} from "../../interfaces/storage/ICategoryStorageService.js";

import {BASE64_PREFIX} from "../../constants/file.js";

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
		const isNewUpload = typeof newImageValue === 'string' && newImageValue.startsWith(BASE64_PREFIX);
		const isRemoval = !newImageValue;
		const oldImageExists = !!oldImageValue;

		let finalImageUrl = oldImageValue;

		// 1. Determine the new state of the image URL.
		// We prioritize uploading first so that if it fails, the old image is preserved.
		if (isNewUpload) {
			finalImageUrl = await this.#categoryStorageService.upload(newImageValue);
		}
		// 2. // Client provided an existing URL string; retain it.
		else if (newImageValue) {
			finalImageUrl = newImageValue;
		}
		else if (isRemoval) {
			finalImageUrl = null;
		}

		// 3. Cleanup orphaned images.
		if (oldImageExists && (isNewUpload || isRemoval)) {
			await this.#categoryStorageService.delete(oldImageValue);
		}

		return finalImageUrl;
	}

	async deleteImage(imageUrl) {
		return this.#categoryStorageService.delete(imageUrl);
	}
}