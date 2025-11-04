import {ICategoryImageManager} from "../../interfaces/category/ICategoryImageManager.js";
import {ICategoryStorageService} from "../../interfaces/storage/ICategoryStorageService.js";

import {BASE64_PREFIX} from "../../utils/constants.js";

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

		// 1. Delete the old image if it exists AND is being replaced by a new upload OR explicitly removed.
		if (oldImageExists && (isNewUpload || isRemoval)) {
			await this.#categoryStorageService.delete(oldImageValue);
			finalImageUrl = null; // Clear URL
		}

		// 2. Upload the new image if it is a Base64 string.
		if (isNewUpload) {
			finalImageUrl = await this.#categoryStorageService.upload(newImageValue);
		}
		// 3. Otherwise, if newImageValue is provided (and it's a non-Base64 string, meaning an existing URL), keep it.
		else if (newImageValue && !isRemoval) {
			finalImageUrl = newImageValue;
		}
		// 4. If nothing was uploaded and nothing was retained, it remains null.

		return finalImageUrl;
	}

	async deleteImage(imageUrl) {
		return this.#categoryStorageService.delete(imageUrl);
	}
}