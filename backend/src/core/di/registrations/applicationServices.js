import {EmailNotificationService} from "../../../application/shared/notifications/EmailNotificationService.js";
import {ProductService} from "../../../application/product/ProductService.js";
import {CategoryService} from "../../../application/category/CategoryService.js";
import {CartService} from "../../../application/cart/CartService.js";
import {UserService} from "../../../application/user/UserService.js";
import {UserStatsService} from "../../../application/user/UserStatsService.js";
import {UserTokenService} from "../../../application/user/UserTokenService.js";
import {UserAccountService} from "../../../application/user/UserAccountService.js";
import {ProductStatsService} from "../../../application/product/ProductStatsService.js";
import {SessionAuthService} from "../../../application/auth/SessionAuthService.js";
import {ReviewService} from "../../../application/review/ReviewService.js";
import {AnalyticsService} from "../../../application/analytics/AnalyticsService.js";
import {OrderService} from "../../../application/order/OrderService.js";
import {CouponService} from "../../../application/coupon/CouponService.js";
import {CheckoutService} from "../../../application/checkout/CheckoutService.js";

import {
    ApplicationServiceTypes, CacheRepositoryTypes,
    DatabaseRepositoryTypes, FactoryTypes, ImageManagerTypes,
    InfrastructureServiceTypes, MapperTypes, ProviderTypes, ValidatorTypes,
} from "../../../constants/ioc.js";

import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerApplicationServices = (container) => {
    container.register(ApplicationServiceTypes.EMAIL_NOTIFICATION, () => {
        const emailProvider = container.get(ProviderTypes.EMAIL);
        const templateService = container.get(InfrastructureServiceTypes.TEMPLATE);
        const resetPasswordUrlBase = new URL(config.server.passwordResetUrl, config.server.clientUrl).toString();

        return new EmailNotificationService(emailProvider, templateService, resetPasswordUrlBase);
    });

    container.register(ApplicationServiceTypes.CATEGORY, CategoryService,
        [DatabaseRepositoryTypes.CATEGORY, ImageManagerTypes.CATEGORY]
    );

    container.register(ApplicationServiceTypes.PRODUCT, () => {
        const productDatabaseRepository =  container.get(DatabaseRepositoryTypes.PRODUCT);
        const categoryService =  container.get(ApplicationServiceTypes.CATEGORY);
        const productCacheRepository =  container.get(CacheRepositoryTypes.PRODUCT);
        const productImageManager =  container.get(ImageManagerTypes.PRODUCT);
        const recommendationsInCartSize = config.business.product.recommendationsInCartSize;

        return new ProductService(
            productDatabaseRepository,
            categoryService,
            productCacheRepository,
            productImageManager,
            recommendationsInCartSize
        );
    });
    container.register(ApplicationServiceTypes.PRODUCT_STATS, ProductStatsService, [DatabaseRepositoryTypes.PRODUCT]);

    container.register(ApplicationServiceTypes.CART, CartService,
        [DatabaseRepositoryTypes.CART, ApplicationServiceTypes.PRODUCT]
    );

    container.register(ApplicationServiceTypes.USER, UserService,
        [DatabaseRepositoryTypes.USER, InfrastructureServiceTypes.PASSWORD]
    );
    container.register(ApplicationServiceTypes.USER_STATS, UserStatsService, [DatabaseRepositoryTypes.USER]);
    container.register(ApplicationServiceTypes.USER_TOKEN, UserTokenService, [DatabaseRepositoryTypes.USER, InfrastructureServiceTypes.PASSWORD]);
    container.register(ApplicationServiceTypes.USER_ACCOUNT, UserAccountService,
        [
            ApplicationServiceTypes.USER,
            ApplicationServiceTypes.EMAIL_NOTIFICATION,
            InfrastructureServiceTypes.PASSWORD,
            InfrastructureServiceTypes.JWT,
            CacheRepositoryTypes.AUTH,
            ApplicationServiceTypes.USER_TOKEN
        ]
    );

    container.register(ApplicationServiceTypes.SESSION_AUTH, SessionAuthService,
        [ApplicationServiceTypes.USER, InfrastructureServiceTypes.PASSWORD, InfrastructureServiceTypes.JWT, CacheRepositoryTypes.AUTH]
    );

    container.register(ApplicationServiceTypes.REVIEW, ReviewService, [
        DatabaseRepositoryTypes.REVIEW,
        ApplicationServiceTypes.USER,
        ApplicationServiceTypes.PRODUCT,
        ApplicationServiceTypes.PRODUCT_STATS,
        ValidatorTypes.REVIEW
    ]);

    container.register(ApplicationServiceTypes.ANALYTICS, AnalyticsService,
        [DatabaseRepositoryTypes.ORDER, DatabaseRepositoryTypes.USER, DatabaseRepositoryTypes.PRODUCT]
    );

    container.register(ApplicationServiceTypes.ORDER, OrderService, [DatabaseRepositoryTypes.ORDER, ApplicationServiceTypes.USER]);

    container.register(ApplicationServiceTypes.COUPON, CouponService, [
        DatabaseRepositoryTypes.COUPON,
        ApplicationServiceTypes.USER,
        ValidatorTypes.COUPON,
        FactoryTypes.COUPON,
        MapperTypes.COUPON
    ]);

    container.register(ApplicationServiceTypes.CHECKOUT, () => {
        const paymentProvider = container.get(ProviderTypes.PAYMENT);
        const productService = container.get(ApplicationServiceTypes.PRODUCT);
        const orderService = container.get(ApplicationServiceTypes.ORDER);
        const cartService = container.get(ApplicationServiceTypes.CART);
        const couponService = container.get(ApplicationServiceTypes.COUPON);
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

export default registerApplicationServices;