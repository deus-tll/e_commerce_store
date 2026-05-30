import {UserTokenService} from "../../../application/user/UserTokenService.js";
import {UserStatsService} from "../../../application/user/UserStatsService.js";
import {UserService} from "../../../application/user/UserService.js";
import {UserAccountService} from "../../../application/user/UserAccountService.js";
import {ProductStatsService} from "../../../application/product/ProductStatsService.js";
import {ReviewService} from "../../../application/review/ReviewService.js";
import {OrderService} from "../../../application/order/OrderService.js";
import {CouponService} from "../../../application/coupon/CouponService.js";
import {AnalyticsService} from "../../../application/analytics/AnalyticsService.js";
import {SessionAuthService} from "../../../application/auth/SessionAuthService.js";
import {CheckoutService} from "../../../application/checkout/CheckoutService.js";

import {
    DatabaseRepositoryTypes, ProviderTypes, FactoryTypes,
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

    container.register(ServiceTypes.PRODUCT_STATS, ProductStatsService, [DatabaseRepositoryTypes.PRODUCT]);
    // =============
    // Review
    container.register(ServiceTypes.REVIEW, ReviewService, [
        DatabaseRepositoryTypes.REVIEW,
        ServiceTypes.USER,
        ApplicationServiceTypes.PRODUCT,
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
        const productService = container.get(ApplicationServiceTypes.PRODUCT);
        const orderService = container.get(ServiceTypes.ORDER);
        const cartService = container.get(ApplicationServiceTypes.CART);
        const couponService = container.get(ServiceTypes.COUPON);
        const minAmountForGrant = config.business.coupon.minAmountForGrant;

        return new CheckoutService(
            paymentProvider,
            productService,
            orderService,
            cartService,
            couponService,
            minAmountForGrant
        );
    });
}

export default registerDomainServices;