import {AdminSeeder} from "../../../seeders/AdminSeeder.js";
import {ProductsDummyJsonSeeder} from "../../../seeders/ProductsDummyJsonSeeder.js";

import {SeederTypes, ServiceTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerSeeders = (container) => {
    container.register(SeederTypes.ADMIN, AdminSeeder, [ServiceTypes.USER]);
    container.register(SeederTypes.PRODUCTS_DUMMY_JSON, ProductsDummyJsonSeeder, [
        ServiceTypes.CATEGORY,
        ServiceTypes.PRODUCT,
        ServiceTypes.USER,
        ServiceTypes.REVIEW
    ]);
}

export default registerSeeders;