import {IStorageProvider} from "../../interfaces/storage/IStorageProvider.js";
import {IProductStorageService} from "../../interfaces/storage/IProductStorageService.js";

import {FileFolders} from "../../constants/file.js";

/**
 * Service to manage file operations specific to the 'products' domain.
 * @augments IProductStorageService
 */
export class ProductStorageService extends IProductStorageService {
	/** @type {IStorageProvider} */ #storageService;
	/** @type {string} */ #folder = FileFolders.PRODUCTS;

	/**
	 * @param {IStorageProvider} storageService
	 */
	constructor(storageService) {
		super();
		this.#storageService = storageService;
	}

	async upload(file) {
		return this.#storageService.upload(file, this.#folder);
	}

	async delete(fileUrl) {
		return this.#storageService.delete(fileUrl, this.#folder);
	}
}