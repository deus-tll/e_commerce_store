import {ProductStorageService} from "../shared/storage/AppStorageServices.js";
import {ProductImage} from "../../entities/product/types/ProductImage.js";

import {DomainValidationError} from "../../errors/index.js";
import {ImageTracker, withSafeUpload} from "../shared/utils/withSafeUpload.js";

interface UpdateMainImageResult {
	mainImage: string;
	urlsToDelete: string[];
}

interface UpdateAdditionalImagesResult {
	additionalImages: string[];
	urlsToDelete: string[];
}

interface UpdateImagesResult {
	images: ProductImage,
	urlsToDelete: string[],
}

export class ProductImageManager {
	constructor(
		private readonly productStorageService: ProductStorageService
	) {}

	private validatePresence(value: string): void {
		if (!value) {
			throw new DomainValidationError("Main product image is required.");
		}
	}

	private async updateMainImage(
		track: ImageTracker,
		existingMain: string,
		newMain?: string
	): Promise<UpdateMainImageResult> {
		if (newMain === undefined || newMain === existingMain) {
			return { mainImage: existingMain, urlsToDelete: [] };
		}

		this.validatePresence(newMain);

		const uploadedUrl = await track(newMain);
		return {
			mainImage: uploadedUrl,
			urlsToDelete: existingMain ? [existingMain] : []
		};
	}

	private async updateAdditionalImages(
		track: ImageTracker,
		existingAdditionals: readonly string[],
		newAdditionals?: readonly string[]
	): Promise<UpdateAdditionalImagesResult> {
		if (!Array.isArray(newAdditionals)) {
			return {
				additionalImages: [...existingAdditionals],
				urlsToDelete: []
			};
		}

		const retainedSet = new Set<string>();
		const imagesToUpload: string[] = [];

		for (const image of newAdditionals) {
			if (typeof image !== "string") continue;

			if (existingAdditionals.includes(image)) {
				retainedSet.add(image);
			} else {
				imagesToUpload.push(image);
			}
		}

		const uploadedUrls = await Promise.all(
			imagesToUpload.map(img => track(img))
		);

		const urlsToDelete = existingAdditionals.filter(oldUrl => oldUrl && !retainedSet.has(oldUrl));

		return {
			additionalImages: [...retainedSet, ...uploadedUrls],
			urlsToDelete
		};
	}

	async imageDataUploadOnCreate(imageData: ProductImage): Promise<ProductImage> {
		const additionalImages = imageData.additionalImages || [];

		return withSafeUpload(this.productStorageService, async (track: ImageTracker) => {
			const [mainImageUrl, ...additionalImagesUrls] = await Promise.all([
				track(imageData.mainImage),
				...additionalImages.map(rawImage => track(rawImage))
			]);

			return new ProductImage({
				mainImage: mainImageUrl,
				additionalImages: additionalImagesUrls,
			});
		});
	}

	async imageDataUploadOnUpdate(newImageData: Partial<ProductImage>, existingImageData: ProductImage): Promise<UpdateImagesResult> {
		return withSafeUpload(this.productStorageService, async (track: ImageTracker) => {
			const [mainResult, additionalResult] = await Promise.all([
				this.updateMainImage(track, existingImageData.mainImage, newImageData.mainImage),
				this.updateAdditionalImages(track, existingImageData.additionalImages, newImageData.additionalImages)
			]);

			const finalImagesData = new ProductImage({
				mainImage: mainResult.mainImage,
				additionalImages: additionalResult.additionalImages
			});

			return {
				images: finalImagesData,
				urlsToDelete: [
					...mainResult.urlsToDelete,
					...additionalResult.urlsToDelete
				]
			};
		});
	}

	async deleteByUrls(urls: string[]): Promise<void> {
		const validUrls = urls.filter(Boolean);
		if (validUrls.length === 0) return;

		const results = await Promise.allSettled(
			validUrls.map(url => this.productStorageService.delete(url))
		);

		results.forEach((result, index) => {
			if (result.status === 'rejected') {
				console.warn(`[Product Image Manager] Failed to delete orphaned image: ${validUrls[index]}`, result.reason);
			}
		});
	}

	async deleteImageData(imageData: ProductImage): Promise<void> {
		const urlsToDelete = [imageData.mainImage, ...imageData.additionalImages].filter(Boolean);
		await this.deleteByUrls(urlsToDelete);
	}
}