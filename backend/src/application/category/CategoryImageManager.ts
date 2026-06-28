import {CategoryStorageService} from "../shared/storage/AppStorageServices.js";
import {ValidationError} from "../../errors/index.js";
import {ImageTracker, withSafeUpload} from "../shared/utils/withSafeUpload.js";

export class CategoryImageManager {
	constructor(
		private readonly categoryStorageService: CategoryStorageService
	) {}

	private validatePresence(value: string | null | undefined): void {
		if (!value) {
			throw new ValidationError("Category image is required.");
		}
	}

	async imageDataUploadOnCreateUpdate(
		newImageData: string,
		existingImageData: string | null
	): Promise<string> {
		this.validatePresence(newImageData);

		if (newImageData === existingImageData) {
			return existingImageData as string;
		}

		return withSafeUpload(this.categoryStorageService, async (track: ImageTracker) => {
			const finalImageUrl = await track(newImageData);

			if (existingImageData) {
				await this.categoryStorageService.delete(existingImageData);
			}

			return finalImageUrl;
		})
	}

	async deleteByUrl(url: string): Promise<void> {
		return this.categoryStorageService.delete(url);
	}
}