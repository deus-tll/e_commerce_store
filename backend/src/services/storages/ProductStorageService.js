import {IStorageProvider} from "../../interfaces/storage/IStorageProvider.js";
import {IProductStorageService} from "../../interfaces/storage/IProductStorageService.js";

import {FileFolders} from "../../constants/file.js";

/**
 * Service to manage file operations specific to the 'products' domain.
 * @augments IProductStorageService
 */
export class ProductStorageService extends IProductStorageService {
	/** @type {IStorageProvider} */ #storageProvider;
	/** @type {string} */ #folder = FileFolders.PRODUCTS;

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
		return this.#storageProvider.delete(fileUrl, this.#folder);
	}
}