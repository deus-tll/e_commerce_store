import {
    CategoryStorageService,
    ProductStorageService
} from "../../../application/shared/storage/AppStorageServices.js";
import {ProviderTypes, StorageServiceTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerStorageServices = (container) => {
    container.register(StorageServiceTypes.CATEGORY, CategoryStorageService, [ProviderTypes.STORAGE]);
    container.register(StorageServiceTypes.PRODUCT, ProductStorageService, [ProviderTypes.STORAGE]);
}

export default registerStorageServices;