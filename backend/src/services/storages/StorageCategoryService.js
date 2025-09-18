import {StorageServiceBase} from "./StorageServiceBase.js";
import {FileFolders} from "../../utils/constants.js";

export class StorageCategoryService extends StorageServiceBase {
	constructor() {
		super(FileFolders.CATEGORIES);
	}
}