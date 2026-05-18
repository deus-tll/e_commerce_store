import {IProductImageManager} from "../../interfaces/product/IProductImageManager.js";
import {ProductStorageService} from "../../application/services/storage/AppStorageServices.js";
import {ProductImage} from "../../domain/index.js";

import {DomainValidationError} from "../../errors/index.js";

/**
 * @augments IProductImageManager
 * @description Domain manager for Product image workflow.
 */
export class ProductImageManager extends IProductImageManager {
	/** @type {ProductStorageService} */ #productStorageService;

	/**
	 * @param {ProductStorageService} productStorageManager
	 */
	constructor(productStorageManager) {
		super();
		this.#productStorageService = productStorageManager;
	}

	#validatePresence(value) {
		if (!value) {
			throw new DomainValidationError("Main product image is required.");
		}
	}

	async #updateMainImage(newMain, existingMain, urlsToDelete) {
		if (newMain === undefined) return existingMain;
		this.#validatePresence(newMain);

		if (newMain !== existingMain) {
			const uploadedUrl = await this.#productStorageService.upload(newMain);
			if (existingMain) urlsToDelete.push(existingMain);
			return uploadedUrl;
		}

		return existingMain;
	}

	async #updateAdditionalImages(newAdditionals, existingAdditionals, urlsToDelete) {
		if (!Array.isArray(newAdditionals)) return [...existingAdditionals];

		const retainedSet = new Set();
		const imagesToUpload = [];

		for (const image of newAdditionals) {
			if (typeof image !== "string") continue;

			if (existingAdditionals.includes(image)) {
				retainedSet.add(image);
			} else {
				imagesToUpload.push(image);
			}
		}

		const uploadedUrls = await Promise.all(
			imagesToUpload.map(img => this.#productStorageService.upload(img))
		);

		for (const oldUrl of existingAdditionals) {
			if (oldUrl && !retainedSet.has(oldUrl)) {
				urlsToDelete.push(oldUrl);
			}
		}

		return [...retainedSet, ...uploadedUrls];
	}

	/**
	 * @param {ProductImage} imageData
	 * @returns {string[]}
	 */
	#toArrayUrls(imageData) {
		return [
			imageData.mainImage,
			...imageData.additionalImages
		].filter(Boolean);
	}

	async imageDataUploadOnCreate(imageData) {
		const additionalImages = imageData.additionalImages || [];

		const mainImagePromise = this.#productStorageService.upload(imageData.mainImage);
		const additionalImagePromises = additionalImages.map(rawImage =>
			this.#productStorageService.upload(rawImage)
		);

		const uploads = [
			mainImagePromise,
			...additionalImagePromises,
		];

		const [mainImageUrl, ...additionalImagesUrls] = await Promise.all(uploads);

		return new ProductImage({
			mainImage: mainImageUrl,
			additionalImages: additionalImagesUrls,
		});
	}

	async imageDataUploadOnUpdate(newImageData, existingImageData) {
		const urlsToDelete = [];

		const finalMainImage = await this.#updateMainImage(
			newImageData.mainImage,
			existingImageData.mainImage,
			urlsToDelete
		);

		const finalAdditionalImages = await this.#updateAdditionalImages(
			newImageData.additionalImages,
			existingImageData.additionalImages,
			urlsToDelete
		);

		const finalImagesData = new ProductImage({
			mainImage: finalMainImage,
			additionalImages: finalAdditionalImages
		});

		return { finalImagesData, urlsToDelete };
	}

	async deleteByUrls(urls) {
		const validUrls = urls.filter(url => url);
		if (validUrls.length === 0) return;

		const results = await Promise.allSettled(
			validUrls.map(url => this.#productStorageService.delete(url))
		);

		results.forEach((result, index) => {
			if (result.status === 'rejected') {
				console.warn(`[Product Image Manager] Failed to delete orphaned image: ${validUrls[index]}`, result.reason);
			}
		});
	}

	async deleteImageData(imageData) {
		const urlsToDelete = this.#toArrayUrls(imageData);
		await this.deleteByUrls(urlsToDelete);
	}
}