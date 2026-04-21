import cloudinary from "../../infrastructure/cloudinary.js";

import {IStorageService} from "../../interfaces/storage/IStorageService.js";

import {SystemError} from "../../errors/index.js";
import {config} from "../../config.js";

/**
 * Cloudinary implementation of the IStorageService contract.
 * @augments IStorageService
 */
export class CloudinaryStorageService extends IStorageService {
	/**
	 * Extracts the public ID segment (excluding folder and extension) from a secure URL.
	 * @param {string} fileUrl
	 * @param {string} folder - The base folder name (e.g., 'categories').
	 * @returns {string | null} The public ID segment (e.g., 'product-123'), or null if extraction fails.
	 */
	#extractPublicIdSegment(fileUrl, folder) {
		// 1. Split the URL path based on the folder name.
		const urlSegments = fileUrl.split(`${folder}/`);

		if (urlSegments.length < 2) {
			// Folder path wasn't found in the URL.
			console.warn(`[Cloudinary] Delete warning: Could not find folder path '${folder}' in URL: ${fileUrl}`);
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

	async upload(file, folder) {
		try {
			const response = await cloudinary.uploader.upload(file, { folder });
			return response["secure_url"];
		}
		catch (error) {
			console.error("[Cloudinary] Upload failed:", error.message);
			throw new SystemError("Failed to upload file to cloud storage.");
		}
	}

	async delete(fileUrl, folder) {
		try {
			if (!fileUrl) return;

			const publicIdSegment = this.#extractPublicIdSegment(fileUrl, folder);

			if (!publicIdSegment) return;

			const fullPublicId = `${folder}/${publicIdSegment}`;
			await cloudinary.uploader.destroy(fullPublicId);
		}
		catch (error) {
			console.error("[Cloudinary] Delete failed:", error.message);
		}
	}

	async deleteAll() {
		if (config.app.isProduction) {
			console.warn("[Cloudinary] Cleanup skipped: Production environment detected.");
			return;
		}

		try {
			console.log("[Cloudinary] Starting cleanup of all assets...");

			let hasMore = true;
			let deletedCount = 0;

			while (hasMore) {
				const result = await cloudinary.api.delete_all_resources({
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