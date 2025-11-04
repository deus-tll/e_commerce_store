/**
 * @interface ICategoryImageManager
 * @description Defines the contract for managing the category image update workflow,
 * coordinating between file uploads, deletions, and retention logic.
 */
export class ICategoryImageManager {
	/**
	 * Handles the complex logic of updating a category image, including
	 * uploading a new file (if Base64), deleting the old file (if replaced or removed),
	 * or retaining an existing URL.
	 * @param {string | null | undefined} newImageValue - The new image data (Base64, URL, or null/empty string).
	 * @param {string | null | undefined} oldImageValue - The existing image URL/path from the database.
	 * @returns {Promise<string | null>} - The final stored image URL/path (or null if removed).
	 */
	async handleImageUpdate(newImageValue, oldImageValue) {
		throw new Error("Method not implemented.");
	}

	/**
	 * Deletes a category image from storage.
	 * @param {string | null | undefined} imageUrl - The URL of the image to delete.
	 * @returns {Promise<void>}
	 */
	async deleteImage(imageUrl) {
		throw new Error("Method not implemented.");
	}
}