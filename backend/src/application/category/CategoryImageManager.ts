import {CategoryStorageService} from "../shared/storage/AppStorageServices.js";
import {DomainValidationError} from "../../errors/index.js";

export class CategoryImageManager {
	private readonly categoryStorageService: CategoryStorageService;

	constructor(categoryStorageManager: CategoryStorageService) {
		this.categoryStorageService = categoryStorageManager;
	}

	private validatePresence(value: string | null | undefined): void {
		if (!value) {
			throw new DomainValidationError("Category image is required.");
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

		const finalImageUrl = await this.categoryStorageService.upload(newImageData);

		if (existingImageData) {
			await this.categoryStorageService.delete(existingImageData);
		}

		return finalImageUrl;
	}

	async deleteByUrl(url: string): Promise<void> {
		return this.categoryStorageService.delete(url);
	}
}