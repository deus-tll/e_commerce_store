import {Container} from "../Container.js";

import {AdminSeeder} from "../../../seeders/AdminSeeder.js";
import {ProductsDummyJsonSeeder} from "../../../seeders/ProductsDummyJsonSeeder.js";

import {UserService} from "../../../application/user/UserService.js";
import {CategoryService} from "../../../application/category/CategoryService.js";
import {ProductService} from "../../../application/product/ProductService.js";
import {ReviewService} from "../../../application/review/ReviewService.js";

import {config} from "../../../config.js";

const registerSeeders = (container: Container): void => {
    container.register({
        token: AdminSeeder
    }, [
        UserService,
        config.business.initialAdmin
    ]);

    container.register({
        token: ProductsDummyJsonSeeder
    }, [
        CategoryService,
        ProductService,
        UserService,
        ReviewService,
        config.seeding.dummyJson.productsUrlWithLimit,
        config.seeding.defaultSeederUserPassword,
        config.business.product.featuredProductsMinRating
    ]);
}

export default registerSeeders;