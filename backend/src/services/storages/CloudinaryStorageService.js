import cloudinary from "../../config/cloudinary.js";
import { InternalServerError } from "../../errors/apiErrors.js";
import {IStorageService} from "../../interfaces/IStorageService.js";

/**
 * Cloudinary implementation of the IStorageService contract.
 * The specific folder is set via constructor injection.
 * @augments IStorageService
 */
export class CloudinaryStorageService extends IStorageService {
	/**
	 * @type {string}
	 */
	#folder;

	/**
	 * @param {string} folder - The base folder name in the cloud storage (e.g., 'categories', 'products').
	 */
	constructor(folder) {
		super();
		if (!folder) {
			throw new Error("CloudinaryStorageService requires a folder name.");
		}
		this.#folder = folder;
	}

	async upload(file) {
		try {
			const response = await cloudinary.uploader.upload(file, { folder: this.#folder });
			return response.secure_url;
		}
		catch (error) {
			console.error("Error uploading file to Cloudinary", error);
			throw new InternalServerError("Failed to upload file.");
		}
	}

	async delete(fileUrl) {
		try {
			if (!fileUrl) return;

			// Extract public ID from the URL (e.g., /folder/id.ext -> folder/id)
			const urlParts = fileUrl.split("/");
			const publicIdWithExt = urlParts.pop();
			const publicId = publicIdWithExt.split(".")[0];

			await cloudinary.uploader.destroy(`${this.#folder}/${publicId}`);
		}
		catch (error) {
			console.error("Error deleting file from Cloudinary", error);
		}
	}
}