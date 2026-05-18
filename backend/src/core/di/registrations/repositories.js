import {CartMongooseRepository} from "../../../repositories/mongoose/CartMongooseRepository.js";
import {CategoryMongooseRepository} from "../../../repositories/mongoose/CategoryMongooseRepository.js";
import {CouponMongooseRepository} from "../../../repositories/mongoose/CouponMongooseRepository.js";
import {OrderMongooseRepository} from "../../../repositories/mongoose/OrderMongooseRepository.js";
import {ProductMongooseRepository} from "../../../repositories/mongoose/ProductMongooseRepository.js";
import {ReviewMongooseRepository} from "../../../repositories/mongoose/ReviewMongooseRepository.js";
import {UserMongooseRepository} from "../../../repositories/mongoose/UserMongooseRepository.js";

import {
    ProviderTypes,
    DatabaseRepositoryTypes,
    CacheRepositoryTypes
} from "../../../constants/ioc.js";
import {AuthCacheRepository} from "../../../infrastructure/repositories/cache/AuthCacheRepository.js";
import {config} from "../../../config.js";
import {ProductCacheRepository} from "../../../infrastructure/repositories/cache/ProductCacheRepository.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerRepositories = (container) => {
    container.register(DatabaseRepositoryTypes.CART, CartMongooseRepository, []);
    container.register(DatabaseRepositoryTypes.CATEGORY, CategoryMongooseRepository, []);
    container.register(DatabaseRepositoryTypes.COUPON, CouponMongooseRepository, []);
    container.register(DatabaseRepositoryTypes.ORDER, OrderMongooseRepository, []);
    container.register(DatabaseRepositoryTypes.PRODUCT, ProductMongooseRepository, []);
    container.register(DatabaseRepositoryTypes.REVIEW, ReviewMongooseRepository, []);
    container.register(DatabaseRepositoryTypes.USER, UserMongooseRepository, []);

    container.register(CacheRepositoryTypes.AUTH, () => {
        const cacheProvider = container.get(ProviderTypes.CACHE);

        return new AuthCacheRepository(
            cacheProvider,
            config.auth.refresh.ttl
        );
    });
    container.register(CacheRepositoryTypes.PRODUCT, ProductCacheRepository, [ProviderTypes.CACHE]);
}

export default registerRepositories;