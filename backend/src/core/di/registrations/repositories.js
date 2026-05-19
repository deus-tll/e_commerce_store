import {CartMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/CartMongooseRepository.js";
import {CategoryMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/CategoryMongooseRepository.ts";
import {CouponMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/CouponMongooseRepository.js";
import {OrderMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/OrderMongooseRepository.js";
import {ProductMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/ProductMongooseRepository.js";
import {ReviewMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/ReviewMongooseRepository.js";
import {UserMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/UserMongooseRepository.js";

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