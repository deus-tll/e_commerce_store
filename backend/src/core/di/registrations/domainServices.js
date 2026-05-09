import {UserTokenService} from "../../../services/user/UserTokenService.js";
import {UserStatsService} from "../../../services/user/UserStatsService.js";
import {UserService} from "../../../services/user/UserService.js";
import {UserAccountService} from "../../../services/user/UserAccountService.js";
import {CategoryService} from "../../../services/category/CategoryService.js";
import {ProductService} from "../../../services/product/ProductService.js";
import {ProductStatsService} from "../../../services/product/ProductStatsService.js";
import {CartService} from "../../../services/cart/CartService.js";
import {ReviewService} from "../../../services/review/ReviewService.js";
import {OrderService} from "../../../services/order/OrderService.js";
import {CouponService} from "../../../services/coupon/CouponService.js";
import {AnalyticsService} from "../../../services/analytics/AnalyticsService.js";
import {SessionAuthService} from "../../../services/auth/SessionAuthService.js";
import {CheckoutService} from "../../../services/checkout/CheckoutService.js";

import {
    RepositoryTypes, UtilityTypes, ProviderTypes,
    FactoryTypes, CacheManagerTypes, ImageManagerTypes,
    MapperTypes, ParserTypes, ValidatorTypes,
    ServiceTypes
} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerDomainServices = (container) => {
    // =============
    // User
    container.register(ServiceTypes.USER_STATS, UserStatsService, [RepositoryTypes.USER]);
    container.register(ServiceTypes.USER_TOKEN, UserTokenService, [RepositoryTypes.USER, ProviderTypes.PASSWORD]);
    container.register(ServiceTypes.USER, UserService,
        [RepositoryTypes.USER, ProviderTypes.PASSWORD, ServiceTypes.USER_TOKEN, MapperTypes.USER, ParserTypes.USER_QUERY]
    );
    container.register(ServiceTypes.USER_ACCOUNT, UserAccountService,
        [ServiceTypes.USER, ProviderTypes.EMAIL, ProviderTypes.PASSWORD, ProviderTypes.JWT, CacheManagerTypes.AUTH, ServiceTypes.USER_TOKEN, MapperTypes.USER]
    );
    // Session Auth
    container.register(ServiceTypes.SESSION_AUTH, SessionAuthService,
        [ServiceTypes.USER, ProviderTypes.PASSWORD, ProviderTypes.JWT, CacheManagerTypes.AUTH]
    );
    // =============
    // =============
    // Category
    container.register(ServiceTypes.CATEGORY, CategoryService,
        [RepositoryTypes.CATEGORY, ImageManagerTypes.CATEGORY, MapperTypes.CATEGORY, UtilityTypes.SLUG]
    );
    // =============
    // Product
    container.register(ServiceTypes.PRODUCT, ProductService,
        [RepositoryTypes.PRODUCT, ServiceTypes.CATEGORY, CacheManagerTypes.PRODUCT, ImageManagerTypes.PRODUCT, ParserTypes.PRODUCT_QUERY, MapperTypes.PRODUCT]
    );
    container.register(ServiceTypes.PRODUCT_STATS, ProductStatsService, [RepositoryTypes.PRODUCT]);
    // =============
    // Cart
    container.register(ServiceTypes.CART, CartService,
        [RepositoryTypes.CART, ServiceTypes.PRODUCT, MapperTypes.CART]
    );
    // =============
    // Review
    container.register(ServiceTypes.REVIEW, ReviewService, [
        RepositoryTypes.REVIEW,
        ServiceTypes.USER,
        ServiceTypes.PRODUCT,
        ServiceTypes.PRODUCT_STATS,
        ValidatorTypes.REVIEW,
        MapperTypes.REVIEW
    ]);
    // =============
    // Order
    container.register(ServiceTypes.ORDER, OrderService, [RepositoryTypes.ORDER, ServiceTypes.USER, MapperTypes.ORDER]);
    // =============
    // Coupon
    container.register(ServiceTypes.COUPON, CouponService, [
        RepositoryTypes.COUPON,
        ServiceTypes.USER,
        ValidatorTypes.COUPON,
        FactoryTypes.COUPON,
        MapperTypes.COUPON
    ]);
    // =============
    // Analytics
    container.register(ServiceTypes.ANALYTICS, AnalyticsService,
        [RepositoryTypes.ORDER, RepositoryTypes.USER, RepositoryTypes.PRODUCT, UtilityTypes.DATE]
    );
    // =============
    // Payment
    container.register(ServiceTypes.CHECKOUT, () => {
        const paymentProvider = container.get(ProviderTypes.PAYMENT);
        const productService = container.get(ServiceTypes.PRODUCT);
        const orderService = container.get(ServiceTypes.ORDER);
        const cartService = container.get(ServiceTypes.CART);
        const couponService = container.get(ServiceTypes.COUPON);
        const minAmountForGrant = config.business.coupon.minAmountForGrant;

        return new CheckoutService(paymentProvider, productService, orderService, cartService, couponService, minAmountForGrant);
    });
}

export default registerDomainServices;