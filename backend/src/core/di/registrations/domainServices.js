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
    DatabaseRepositoryTypes, ProviderTypes,
    FactoryTypes, ImageManagerTypes,
    MapperTypes, ParserTypes, ValidatorTypes,
    ServiceTypes, InfrastructureServiceTypes, ApplicationServiceTypes, CacheRepositoryTypes
} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerDomainServices = (container) => {
    // =============
    // User
    container.register(ServiceTypes.USER_STATS, UserStatsService, [DatabaseRepositoryTypes.USER]);
    container.register(ServiceTypes.USER_TOKEN, UserTokenService, [DatabaseRepositoryTypes.USER, InfrastructureServiceTypes.PASSWORD]);
    container.register(ServiceTypes.USER, UserService,
        [DatabaseRepositoryTypes.USER, InfrastructureServiceTypes.PASSWORD, ServiceTypes.USER_TOKEN, MapperTypes.USER, ParserTypes.USER_QUERY]
    );
    container.register(ServiceTypes.USER_ACCOUNT, UserAccountService,
        [ServiceTypes.USER, ApplicationServiceTypes.EMAIL_NOTIFICATION, InfrastructureServiceTypes.PASSWORD, InfrastructureServiceTypes.JWT, CacheRepositoryTypes.AUTH, ServiceTypes.USER_TOKEN, MapperTypes.USER]
    );
    // Session Auth
    container.register(ServiceTypes.SESSION_AUTH, SessionAuthService,
        [ServiceTypes.USER, InfrastructureServiceTypes.PASSWORD, InfrastructureServiceTypes.JWT, CacheRepositoryTypes.AUTH]
    );
    // =============
    // =============
    // Category
    container.register(ServiceTypes.CATEGORY, CategoryService,
        [DatabaseRepositoryTypes.CATEGORY, ImageManagerTypes.CATEGORY, MapperTypes.CATEGORY]
    );
    // =============
    // Product
    container.register(ServiceTypes.PRODUCT, ProductService,
        [DatabaseRepositoryTypes.PRODUCT, ServiceTypes.CATEGORY, CacheRepositoryTypes.PRODUCT, ImageManagerTypes.PRODUCT, ParserTypes.PRODUCT_QUERY, MapperTypes.PRODUCT]
    );
    container.register(ServiceTypes.PRODUCT_STATS, ProductStatsService, [DatabaseRepositoryTypes.PRODUCT]);
    // =============
    // Cart
    container.register(ServiceTypes.CART, CartService,
        [DatabaseRepositoryTypes.CART, ServiceTypes.PRODUCT, MapperTypes.CART]
    );
    // =============
    // Review
    container.register(ServiceTypes.REVIEW, ReviewService, [
        DatabaseRepositoryTypes.REVIEW,
        ServiceTypes.USER,
        ServiceTypes.PRODUCT,
        ServiceTypes.PRODUCT_STATS,
        ValidatorTypes.REVIEW,
        MapperTypes.REVIEW
    ]);
    // =============
    // Order
    container.register(ServiceTypes.ORDER, OrderService, [DatabaseRepositoryTypes.ORDER, ServiceTypes.USER, MapperTypes.ORDER]);
    // =============
    // Coupon
    container.register(ServiceTypes.COUPON, CouponService, [
        DatabaseRepositoryTypes.COUPON,
        ServiceTypes.USER,
        ValidatorTypes.COUPON,
        FactoryTypes.COUPON,
        MapperTypes.COUPON
    ]);
    // =============
    // Analytics
    container.register(ServiceTypes.ANALYTICS, AnalyticsService,
        [DatabaseRepositoryTypes.ORDER, DatabaseRepositoryTypes.USER, DatabaseRepositoryTypes.PRODUCT]
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