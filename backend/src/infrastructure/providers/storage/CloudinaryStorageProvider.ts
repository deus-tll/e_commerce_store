import { v2 as Cloudinary, UploadApiResponse } from "cloudinary";
import {IStorageProvider} from "./IStorageProvider.js";
import {SystemError} from "../../../errors/index.js";

export class CloudinaryStorageProvider extends IStorageProvider {
	private readonly cloudinary: typeof Cloudinary;
	private readonly isProduction: boolean;

	constructor(cloudinary: typeof Cloudinary, isProduction: boolean) {
		super();
		this.cloudinary = cloudinary;
		this.isProduction = isProduction;
	}

	#extractPublicIdSegment(fileUrl: string, folder: string): string | null {
		// 1. Split the URL path based on the folder name.
		const urlSegments = fileUrl.split(`${folder}/`);

		if (urlSegments.length < 2) {
			// Folder path wasn't found in the URL.
			console.warn(`[Cloudinary] Could not find folder path '${folder}' in URL: ${fileUrl}`);
			return null;
		}

		const publicIdWithExt = urlSegments.pop(); // e.g., 'product-123.jpg'

		// 2. Extract the public ID by removing the file extension (everything before the last dot).
		const lastDotIndex = publicIdWithExt.lastIndexOf('.');

		if (lastDotIndex === -1) {
			// Handle case where file has no extension
			console.warn(`[Cloudinary] Delete warning: Could not find file extension in URL segment: ${publicIdWithExt}`);
			return null;
		}

		// Returns the public ID segment, e.g., 'product-123'
		return publicIdWithExt.substring(0, lastDotIndex);
	}

	async upload(file: string, folder: string): Promise<string> {
		try {
			const response: UploadApiResponse = await this.cloudinary.uploader.upload(file, { folder });
			return response.secure_url;
		}
		catch (error) {
			console.error("[Cloudinary] Upload failed:", error.message);
			throw new SystemError("Failed to upload file to cloud storage.");
		}
	}

	async delete(fileUrl: string | null, folder: string): Promise<void> {
		try {
			if (!fileUrl) return;

			const publicIdSegment = this.#extractPublicIdSegment(fileUrl, folder);

			if (!publicIdSegment) return;

			const fullPublicId = `${folder}/${publicIdSegment}`;
			await this.cloudinary.uploader.destroy(fullPublicId);
		}
		catch (error) {
			console.error("[Cloudinary] Delete failed:", error.message);
		}
	}

	async deleteAll(): Promise<void> {
		if (this.isProduction) {
			console.warn("[Cloudinary] Cleanup skipped: Production environment detected.");
			return;
		}

		try {
			console.log("[Cloudinary] Starting cleanup of all assets...");

			let hasMore = true;
			let deletedCount = 0;

			while (hasMore) {
				const result = await this.cloudinary.api.delete_all_resources({
					resource_type: 'image',
					invalidate: true,
					max_results: 1000
				});

				const count = Object.keys(result.deleted).length;
				deletedCount += count;

				hasMore = !!result.next_cursor;

				if (hasMore) {
					console.log(`[Cloudinary] Deleted ${deletedCount} assets, moving to next batch...`);
				}
			}

			console.log(`[Cloudinary] Cleanup complete. Total assets removed: ${deletedCount}`);
		}
		catch (error) {
			console.error("[Cloudinary] Cleanup failed:", error.message);
		}
	}
}