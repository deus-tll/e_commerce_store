import {CategoryImageManager} from "../../../services/category/CategoryImageManager.js";
import {ProductImageManager} from "../../../services/product/ProductImageManager.js";
import {ApplicationServiceTypes, ImageManagerTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerImageManagers = (container) => {
    container.register(ImageManagerTypes.CATEGORY, CategoryImageManager, [ApplicationServiceTypes.CATEGORY_STORAGE]);
    container.register(ImageManagerTypes.PRODUCT, ProductImageManager, [ApplicationServiceTypes.PRODUCT_STORAGE]);
}

export default registerImageManagers;