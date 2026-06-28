import { v2 as Cloudinary, UploadApiResponse } from "cloudinary";
import {IStorageProvider} from "./IStorageProvider.js";
import {SystemError} from "../../../errors/index.js";
import {getErrorMessage} from "../../../utils/error.js";

export interface CloudinaryConfigOptions {
	cloudName: string;
	apiKey: string;
	apiSecret: string;
}

export class CloudinaryStorageProvider extends IStorageProvider {
	private readonly isProduction: boolean;

	constructor(cloudinaryConfigOptions: CloudinaryConfigOptions, isProduction: boolean) {
		super();

		Cloudinary.config({
			cloud_name: cloudinaryConfigOptions.cloudName,
			api_key: cloudinaryConfigOptions.apiKey,
			api_secret: cloudinaryConfigOptions.apiSecret,
		});

		this.isProduction = isProduction;
	}

	private extractPublicIdSegment(fileUrl: string, folder: string): string | null {
		// 1. Split the URL path based on the folder name.
		const urlSegments = fileUrl.split(`${folder}/`);

		if (urlSegments.length < 2) {
			// Folder path wasn't found in the URL.
			console.warn(`[Cloudinary] Could not find folder path '${folder}' in URL: ${fileUrl}`);
			return null;
		}

		const publicIdWithExt = urlSegments.pop(); // e.g., 'product-123.jpg'

		if (!publicIdWithExt) {
			console.warn(`[Cloudinary] Could not extract public ID from: ${publicIdWithExt}`);
			return null;
		}

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
			const response: UploadApiResponse = await Cloudinary.uploader.upload(file, { folder });
			return response.secure_url;
		}
		catch (error: unknown) {
			console.error("[Cloudinary] Upload failed:", getErrorMessage(error));
			throw new SystemError("Failed to upload file to cloud storage.");
		}
	}

	async delete(fileUrl: string | null, folder: string): Promise<void> {
		try {
			if (!fileUrl) return;

			const publicIdSegment = this.extractPublicIdSegment(fileUrl, folder);

			if (!publicIdSegment) return;

			const fullPublicId = `${folder}/${publicIdSegment}`;
			await Cloudinary.uploader.destroy(fullPublicId);
		}
		catch (error: unknown) {
			console.error("[Cloudinary] Delete failed:", getErrorMessage(error));
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
				const result = await Cloudinary.api.delete_all_resources({
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
		catch (error: unknown) {
			console.error("[Cloudinary] Cleanup failed:", getErrorMessage(error));
		}
	}
}