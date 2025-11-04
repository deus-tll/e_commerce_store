/**
 * @interface IStorageService
 * @description Defines the contract for storage operations (uploading and deleting files) with an external provider.
 */
export class IStorageService {
	/**
	 * Uploads a file (e.g., Base64 string or buffer) to the storage provider.
	 * @param {string} file - The file content (e.g., Base64 encoded string).
	 * @param {string} folder - The destination folder name (e.g., 'categories'). 👈 New Required Parameter
	 * @returns {Promise<string>} - The secure, publicly accessible URL of the uploaded file.
	 */
	async upload(file, folder) { throw new Error("Method not implemented."); }

	/**
	 * Deletes a file from the storage provider using its URL.
	 * @param {string | null} fileUrl - The URL of the file to delete.
	 * @param {string} folder - The base folder name required for identifying the asset in the provider. 👈 New Required Parameter
	 * @returns {Promise<void>}
	 */
	async delete(fileUrl, folder) { throw new Error("Method not implemented."); }
}