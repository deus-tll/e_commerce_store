import {CategoryImageManager} from "../../../services/category/CategoryImageManager.js";
import {ProductImageManager} from "../../../services/product/ProductImageManager.js";
import {ImageManagerTypes, StorageManagerTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerImageManagers = (container) => {
    container.register(ImageManagerTypes.CATEGORY, CategoryImageManager, [StorageManagerTypes.CATEGORY]);
    container.register(ImageManagerTypes.PRODUCT, ProductImageManager, [StorageManagerTypes.PRODUCT]);
}

export default registerImageManagers;