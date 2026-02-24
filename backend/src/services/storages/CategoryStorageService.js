import {ICategoryStorageService} from "../../interfaces/storage/ICategoryStorageService.js";
import {IStorageService} from "../../interfaces/storage/IStorageService.js";

import {FileFolders} from "../../constants/file.js";

/**
 * Service to manage file operations specific to the 'categories' domain.
 * @augments ICategoryStorageService
 */
export class CategoryStorageService extends ICategoryStorageService {
	/** @type {IStorageService} */ #storageService;
	/** @type {string} */ #folder = FileFolders.CATEGORIES;

	/**
	 * @param {IStorageService} storageService
	 */
	constructor(storageService) {
		super();
		this.#storageService = storageService;
	}

	async upload(file) {
		return this.#storageService.upload(file, this.#folder);
	}

	async delete(fileUrl) {
		if (fileUrl) return this.#storageService.delete(fileUrl, this.#folder);
	}
}