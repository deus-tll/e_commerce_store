import {CartMongooseRepository} from "../../../repositories/mongoose/CartMongooseRepository.js";
import {CategoryMongooseRepository} from "../../../repositories/mongoose/CategoryMongooseRepository.js";
import {CouponMongooseRepository} from "../../../repositories/mongoose/CouponMongooseRepository.js";
import {OrderMongooseRepository} from "../../../repositories/mongoose/OrderMongooseRepository.js";
import {ProductMongooseRepository} from "../../../repositories/mongoose/ProductMongooseRepository.js";
import {ReviewMongooseRepository} from "../../../repositories/mongoose/ReviewMongooseRepository.js";
import {UserMongooseRepository} from "../../../repositories/mongoose/UserMongooseRepository.js";

import {RepositoryTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerRepositories = (container) => {
    container.register(RepositoryTypes.CART, CartMongooseRepository, []);
    container.register(RepositoryTypes.CATEGORY, CategoryMongooseRepository, []);
    container.register(RepositoryTypes.COUPON, CouponMongooseRepository, []);
    container.register(RepositoryTypes.ORDER, OrderMongooseRepository, []);
    container.register(RepositoryTypes.PRODUCT, ProductMongooseRepository, []);
    container.register(RepositoryTypes.REVIEW, ReviewMongooseRepository, []);
    container.register(RepositoryTypes.USER, UserMongooseRepository, []);
}

export default registerRepositories;