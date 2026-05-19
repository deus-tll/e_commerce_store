import {CategoryImageManager} from "../../../application/category/CategoryImageManager.ts";
import {ProductImageManager} from "../../../application/product/ProductImageManager.js";
import {ImageManagerTypes, StorageServiceTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerImageManagers = (container) => {
    container.register(ImageManagerTypes.CATEGORY, CategoryImageManager, [StorageServiceTypes.CATEGORY]);
    container.register(ImageManagerTypes.PRODUCT, ProductImageManager, [StorageServiceTypes.PRODUCT]);
}

export default registerImageManagers;