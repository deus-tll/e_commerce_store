import { IStorageService } from "../../interfaces/storage/IStorageService.js";
import { IProductStorageService } from "../../interfaces/storage/IProductStorageService.js";

import { FileFolders } from "../../utils/constants.js";

const FOLDER_NAME = FileFolders.PRODUCTS;

/**
 * Service to manage file operations specific to the 'products' domain.
 * @augments IProductStorageService
 */
export class ProductStorageService extends IProductStorageService {
	/** @type {IStorageService} */ #storageService;
	/** @type {string} */ #folder = FOLDER_NAME;

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
		return this.#storageService.delete(fileUrl, this.#folder);
	}
}