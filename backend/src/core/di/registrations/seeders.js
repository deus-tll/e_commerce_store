import {AdminSeeder} from "../../../seeders/AdminSeeder.js";
import {ProductsDummyJsonSeeder} from "../../../seeders/ProductsDummyJsonSeeder.js";

import {SeederTypes, ServiceTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerSeeders = (container) => {
    container.register(SeederTypes.ADMIN, () => {
        const userService = container.get(ServiceTypes.USER);
        const { name, email, password } = config.business.initialAdmin;

        return new AdminSeeder(userService, name, email, password);
    });
    container.register(SeederTypes.PRODUCTS_DUMMY_JSON, () => {
        const categoryService = container.get(ServiceTypes.CATEGORY);
        const productService = container.get(ServiceTypes.PRODUCT);
        const userService = container.get(ServiceTypes.USER);
        const reviewService = container.get(ServiceTypes.REVIEW);
        const productsUrlWithLimit = config.seeding.dummyJson.productsUrlWithLimit;
        const defaultSeederUserPassword = config.seeding.defaultSeederUserPassword;
        const featuredProductsMinRating = config.business.product.featuredProductsMinRating;

        return new ProductsDummyJsonSeeder(categoryService, productService, userService, reviewService, productsUrlWithLimit, defaultSeederUserPassword, featuredProductsMinRating);
    });
}

export default registerSeeders;