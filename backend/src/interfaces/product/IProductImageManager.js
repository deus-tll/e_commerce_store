import { ProductImage } from "../../domain/index.js";

/**
 * @interface IProductImageManager
 * @description Contract for managing product image business logic,
 * coordinating file uploads/deletions/updates.
 */
export class IProductImageManager {
	/**
	 * Processes new raw image data for product creation.
	 * @param {ProductImage} imageData - Raw image data (Base64/files).
	 * @returns {Promise<ProductImage>} - Image data with secure URLs.
	 */
	async processNewImagesForCreation(imageData) { throw new Error("Method not implemented."); }

	/**
	 * Handles complex update logic for product images (uploading new, deleting old, retaining others).
	 * @param {object} newImagesData - The partial/full new image data from the update DTO.
	 * @param {ProductImage} existingImages - The current image data from the existing product entity.
	 * @returns {Promise<{finalImagesData: ProductImage, urlsToDelete: string[]}>} - The final image structure and a list of URLs to delete.
	 */
	async handleImageUpdate(newImagesData, existingImages) { throw new Error("Method not implemented."); }

	/**
	 * Executes the deletion of URLs provided by the update handler.
	 * @param {string[]} urls - Array of URLs to delete from storage.
	 * @returns {Promise<void>}
	 */
	async deleteImagesByUrls(urls) { throw new Error("Method not implemented."); }

	/**
	 * Deletes all images associated with a product entity, typically used during product deletion.
	 * @param {ProductImage} images - The image data from the deleted product entity.
	 * @returns {Promise<void>}
	 */
	async deleteProductImages(images) { throw new Error("Method not implemented."); }
}