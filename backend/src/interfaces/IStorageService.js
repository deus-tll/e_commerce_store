/**
 * @interface IStorageService
 * Defines the contract for storage operations (uploading and deleting files).
 */
export class IStorageService {
	/**
	 * Uploads a file (e.g., Base64 string) to the storage provider.
	 * @param {string} file - The file content (e.g., Base64 encoded string).
	 * @returns {Promise<string>} - The secure URL of the uploaded file.
	 */
	async upload(file) { throw new Error("Method not implemented."); }

	/**
	 * Deletes a file from the storage provider using its URL.
	 * @param {string | null} fileUrl - The URL of the file to delete.
	 * @returns {Promise<void>}
	 */
	async delete(fileUrl) { throw new Error("Method not implemented."); }
}