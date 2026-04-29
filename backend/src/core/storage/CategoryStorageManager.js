import {BaseStorageManager} from "./BaseStorageManager.js";
import {FileFolders} from "../../constants/file.js";

export class CategoryStorageManager extends BaseStorageManager {
    constructor(storageProvider) {
        super(storageProvider, FileFolders.CATEGORIES);
    }
}