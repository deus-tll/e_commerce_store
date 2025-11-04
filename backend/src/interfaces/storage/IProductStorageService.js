/**
 * @interface IProductStorageService
 * @description Contract for file storage operations specific to the Product domain.
 * This service ensures files are always handled within the 'products' folder.
 */
export class IProductStorageService {
	/**
	 * Uploads a file (e.g., Base64 string or buffer) to the 'products' folder.
	 * @param {string} file - The file content.
	 * @returns {Promise<string>} - The secure, publicly accessible URL.
	 */
	async upload(file) { throw new Error("Method not implemented."); }

	/**
	 * Deletes a file from the 'products' folder using its URL.
	 * @param {string | null} fileUrl - The URL of the file to delete.
	 * @returns {Promise<void>}
	 */
	async delete(fileUrl) { throw new Error("Method not implemented."); }
}