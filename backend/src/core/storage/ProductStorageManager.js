import {BaseStorageManager} from "./BaseStorageManager.js";
import {FileFolders} from "../../constants/file.js";

export class ProductStorageManager extends BaseStorageManager {
    constructor(storageProvider) {
        super(storageProvider, FileFolders.PRODUCTS);
    }
}