import {IProductImageManager} from "../../interfaces/product/IProductImageManager.js";
import {IProductStorageService} from "../../interfaces/storage/IProductStorageService.js";
import {ProductImage} from "../../domain/index.js";

import {DomainValidationError} from "../../errors/index.js";

/**
 * @augments IProductImageManager
 * @description Manages the business logic for product image uploads, updates, and deletions.
 * Orchestrates interaction between the ProductService and IProductStorageService.
 */
export class ProductImageManager extends IProductImageManager {
	/** @type {IProductStorageService} */ #productStorageService;

	/**
	 * @param {IProductStorageService} productStorageService
	 */
	constructor(productStorageService) {
		super();
		this.#productStorageService = productStorageService;
	}

	/**
	 * Helper to delete multiple image URLs in parallel.
	 * @param {string[]} urls - Array of secure URLs to delete.
	 * @returns {Promise<void>}
	 */
	async #deleteUrls(urls) {
		const validUrls = urls.filter(url => url);
		if (validUrls.length === 0) return;

		const results = await Promise.allSettled(
			validUrls.map(url => this.#productStorageService.delete(url))
		);

		results.forEach((result, index) => {
			if (result.status === 'rejected') {
				console.warn(`[Storage] Failed to delete orphaned image: ${validUrls[index]}`, result.reason);
			}
		});
	}

	async processNewImagesForCreation(imageData) {
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

	async handleImageUpdate(newImagesData, existingImages) {
		const oldImages = existingImages || new ProductImage({ mainImage: "", additionalImages: [] });
		let finalMainImage = oldImages.mainImage;
		let finalAdditionalImages = [...oldImages.additionalImages];
		const urlsToDelete = [];

		// --- 1. Main Image Update ---
		if (newImagesData.mainImage !== undefined) {
			const newMain = newImagesData.mainImage;
			const oldMain = oldImages.mainImage;

			if (!newMain) {
				throw new DomainValidationError("The main image is required and cannot be empty.");
			}

			// If we got any url or base64, and it's not equal to old value:
			// upload to storage new image and delete the old one
			if (newMain && newMain !== oldMain) {
				finalMainImage = await this.#productStorageService.upload(newMain);
				if (oldMain) urlsToDelete.push(oldMain);
			}
			// (Preservation): If newMain === oldImages.mainImage,
			// nothing happens here, and finalMainImage retains its initial
			// preserved value from when it was initialized above.
		}

		// --- 2. Additional Images Update (List Replacement) ---
		if (Array.isArray(newImagesData.additionalImages)) {
			const retainedUrlsSet = new Set();
			const imagesToUpload = [];

			// Identify uploads vs. retentions
			for (const image of newImagesData.additionalImages) {
				if (typeof image !== "string") continue;

				if (oldImages.additionalImages.includes(image)) {
					// This is an existing URL being retained
					retainedUrlsSet.add(image);
				} else {
					// This is a new raw image that needs uploading
					imagesToUpload.push(image);
				}
			}

			// Execute all additional image uploads in parallel
			const uploadedUrls = await Promise.all(
				imagesToUpload.map(rawImage => this.#productStorageService.upload(rawImage))
			);

			// Determine which old URLs to delete
			for (const oldUrl of oldImages.additionalImages) {
				if (oldUrl && !retainedUrlsSet.has(oldUrl)) {
					urlsToDelete.push(oldUrl);
				}
			}

			// Combine retained URLs and new uploaded URLs for the final list
			finalAdditionalImages = [...retainedUrlsSet, ...uploadedUrls];
		}

		const finalImagesData = new ProductImage({
			mainImage: finalMainImage,
			additionalImages: finalAdditionalImages
		});

		return { finalImagesData, urlsToDelete };
	}

	async deleteImagesByUrls(urls) {
		return this.#deleteUrls(urls);
	}

	async deleteProductImages(images) {
		const urlsToDelete = [
			images?.mainImage,
			...(images?.additionalImages || [])
		].filter(url => url);

		await this.#deleteUrls(urlsToDelete);
	}
}