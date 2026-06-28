import {Container} from "../Container.js";

import {ICartRepository} from "../../../application/cart/ICartRepository.js";
import {ICategoryRepository} from "../../../application/category/ICategoryRepository.js";
import {ICouponRepository} from "../../../application/coupon/ICouponRepository.js";
import {IOrderRepository} from "../../../application/order/IOrderRepository.js";
import {IProductRepository} from "../../../application/product/IProductRepository.js";
import {IReviewRepository} from "../../../application/review/IReviewRepository.js";
import {IUserRepository} from "../../../application/user/IUserRepository.js";
import {ICacheProvider} from "../../../infrastructure/providers/cache/ICacheProvider.js";

import {CartMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/CartMongooseRepository.js";
import {CategoryMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/CategoryMongooseRepository.js";
import {CouponMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/CouponMongooseRepository.js";
import {OrderMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/OrderMongooseRepository.js";
import {ProductMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/ProductMongooseRepository.js";
import {ReviewMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/ReviewMongooseRepository.js";
import {UserMongooseRepository} from "../../../infrastructure/repositories/database/mongoose/UserMongooseRepository.js";

import {AuthCacheRepository} from "../../../infrastructure/repositories/cache/AuthCacheRepository.js";
import {ProductCacheRepository} from "../../../infrastructure/repositories/cache/ProductCacheRepository.js";

import {config} from "../../../config.js";

const registerRepositories = (container: Container): void => {
    container.register({
        token: ICartRepository,
        implementation: CartMongooseRepository
    });
    container.register({
        token: ICategoryRepository,
        implementation: CategoryMongooseRepository
    });
    container.register({
        token: ICouponRepository,
        implementation: CouponMongooseRepository
    });
    container.register({
        token: IOrderRepository,
        implementation: OrderMongooseRepository
    });
    container.register({
        token: IProductRepository,
        implementation: ProductMongooseRepository
    });
    container.register({
        token: IReviewRepository,
        implementation: ReviewMongooseRepository
    });
    container.register({
        token: IUserRepository,
        implementation: UserMongooseRepository
    });

    container.register({
        token: AuthCacheRepository,
    }, [
        ICacheProvider,
        config.infrastructure.security.jwt.refresh.ttl
    ]);

    container.register({
        token: ProductCacheRepository,
    }, [ICacheProvider]);
}

export default registerRepositories;