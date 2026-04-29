/**
 * @interface ICategoryImageManager
 * @description Defines the contract for managing the category image workflow,
 * coordinating between file uploads, deletions, and retention logic.
 */
export class ICategoryImageManager {
	/**
	 * Handles the complex logic of updating a category image, including
	 * uploading a new file (if Base64), deleting the old file (if replaced),
	 * or retaining an existing URL.
	 * @param {string} newImageData - The new image data (Base64, URL).
	 * @param {string | null} existingImageData - The existing image URL/path from the database.
	 * @returns {Promise<string>} - The final stored image URL/path.
	 */
	async imageDataUploadOnCreateUpdate(newImageData, existingImageData) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a category image from storage.
	 * @param {string} url - The URL of the image to delete.
	 * @returns {Promise<void>}
	 */
	async deleteByUrl(url) {
		throw new Error("Method not implemented.");
	}
}