import {StorageService} from "../../../infrastructure/storage/StorageService.js";
import {IStorageProvider} from "../../../infrastructure/providers/storage/IStorageProvider.js";

import {Folder} from "../../../enums/storage.js";

export class CategoryStorageService extends StorageService {
    constructor(storageProvider: IStorageProvider) { super(storageProvider, Folder.CATEGORIES); }
}

export class ProductStorageService extends StorageService {
    constructor(storageProvider: IStorageProvider) { super(storageProvider, Folder.PRODUCTS); }
}