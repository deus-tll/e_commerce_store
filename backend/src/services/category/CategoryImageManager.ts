import {ICategoryImageManager} from "../../interfaces/category/ICategoryImageManager.js";
import {CategoryStorageService} from "../../application/services/storage/AppStorageServices.js";
import {DomainValidationError} from "../../errors/index.js";

/**
 * Implementation of the abstract contract for Category image management operations.
 */
export class CategoryImageManager extends ICategoryImageManager {
	private readonly categoryStorageService: CategoryStorageService;

	constructor(categoryStorageManager: CategoryStorageService) {
		super();
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