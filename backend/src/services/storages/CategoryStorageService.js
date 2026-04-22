import {ICategoryStorageService} from "../../interfaces/storage/ICategoryStorageService.js";
import {IStorageProvider} from "../../interfaces/storage/IStorageProvider.js";

import {FileFolders} from "../../constants/file.js";

/**
 * Service to manage file operations specific to the 'categories' domain.
 * @augments ICategoryStorageService
 */
export class CategoryStorageService extends ICategoryStorageService {
	/** @type {IStorageProvider} */ #storageProvider;
	/** @type {string} */ #folder = FileFolders.CATEGORIES;

	/**
	 * @param {IStorageProvider} storageProvider
	 */
	constructor(storageProvider) {
		super();
		this.#storageProvider = storageProvider;
	}

	async upload(file) {
		return this.#storageProvider.upload(file, this.#folder);
	}

	async delete(fileUrl) {
		if (fileUrl) return this.#storageProvider.delete(fileUrl, this.#folder);
	}
}