import {StorageService} from "../../../infrastructure/storage/StorageService.js";
import {IStorageProvider} from "../../../infrastructure/providers/storage/IStorageProvider.js";

import {StorageFolder} from "../../../enums/application.js";

export class CategoryStorageService extends StorageService {
    constructor(storageProvider: IStorageProvider) { super(storageProvider, StorageFolder.CATEGORIES); }
}

export class ProductStorageService extends StorageService {
    constructor(storageProvider: IStorageProvider) { super(storageProvider, StorageFolder.PRODUCTS); }
}