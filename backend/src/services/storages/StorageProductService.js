import {StorageServiceBase} from "./StorageServiceBase.js";
import {FileFolders} from "../../utils/constants.js";

export class StorageProductService extends StorageServiceBase {
	constructor() {
		super(FileFolders.PRODUCTS);
	}
}