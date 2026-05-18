import {
    CategoryStorageService,
    ProductStorageService
} from "../../../application/services/storage/AppStorageServices.js";
import {ApplicationServiceTypes, ProviderTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerStorageServices = (container) => {
    container.register(ApplicationServiceTypes.CATEGORY_STORAGE, CategoryStorageService, [ProviderTypes.STORAGE]);
    container.register(ApplicationServiceTypes.PRODUCT_STORAGE, ProductStorageService, [ProviderTypes.STORAGE]);
}

export default registerStorageServices;