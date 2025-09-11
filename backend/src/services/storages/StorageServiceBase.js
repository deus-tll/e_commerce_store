import cloudinary from "../../config/cloudinary.js";
import {InternalServerError} from "../../errors/apiErrors.js";


export class StorageServiceBase {
	constructor(folder) {
		if (!folder) {
			throw new Error("Cannot instantiate StorageServiceBase directly. Use a specific service.");
		}
		this.folder = folder;
	}

	async upload(file) {
		try {
			const response = await cloudinary.uploader.upload(file, { folder: this.folder });
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

			const publicId = fileUrl.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(`${this.folder}/${publicId}`);
		}
		catch (error) {
			console.error("Error deleting file from Cloudinary", error);
		}
	}
}