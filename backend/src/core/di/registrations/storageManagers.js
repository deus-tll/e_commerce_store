import {CategoryStorageManager} from "../../storage/CategoryStorageManager.js";
import {ProductStorageManager} from "../../storage/ProductStorageManager.js";
import {ProviderTypes, StorageManagerTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerStorageManagers = (container) => {
    container.register(StorageManagerTypes.CATEGORY, CategoryStorageManager, [ProviderTypes.STORAGE]);
    container.register(StorageManagerTypes.PRODUCT, ProductStorageManager, [ProviderTypes.STORAGE]);
}

export default registerStorageManagers;