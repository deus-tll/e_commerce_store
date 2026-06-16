import {Container} from "../Container.js";

import {CategoryImageManager} from "../../../application/category/CategoryImageManager.js";
import {ProductImageManager} from "../../../application/product/ProductImageManager.js";

import {
    CategoryStorageService,
    ProductStorageService
} from "../../../application/shared/storage/AppStorageServices.js";

const registerImageManagers = (container: Container): void => {
    container.register({
        token: CategoryImageManager
    }, [
        CategoryStorageService
    ]);

    container.register({
        token: ProductImageManager
    }, [
        ProductStorageService
    ]);
}

export default registerImageManagers;