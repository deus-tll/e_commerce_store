import {Container} from "../Container.js";

import {IEmailProvider} from "../../../infrastructure/providers/email/IEmailProvider.js";
import {ICategoryRepository} from "../../../application/category/ICategoryRepository.js";
import {IProductRepository} from "../../../application/product/IProductRepository.js";
import {ICartRepository} from "../../../application/cart/ICartRepository.js";
import {IUserRepository} from "../../../application/user/IUserRepository.js";
import {IReviewRepository} from "../../../application/review/IReviewRepository.js";
import {IOrderRepository} from "../../../application/order/IOrderRepository.js";
import {ICouponRepository} from "../../../application/coupon/ICouponRepository.js";
import {IPaymentProvider} from "../../../infrastructure/providers/payment/IPaymentProvider.js";

import {PasswordService} from "../../../infrastructure/security/PasswordService.js";
import {JwtService} from "../../../infrastructure/security/JwtService.js";
import {TemplateService} from "../../../infrastructure/templates/TemplateService.js";
import {CategoryImageManager} from "../../../application/category/CategoryImageManager.js";
import {ProductImageManager} from "../../../application/product/ProductImageManager.js";

import {ProductCacheRepository} from "../../../infrastructure/repositories/cache/ProductCacheRepository.js";
import {AuthCacheRepository} from "../../../infrastructure/repositories/cache/AuthCacheRepository.js";

import {ReviewValidator} from "../../../application/review/ReviewValidator.js";
import {CouponValidator} from "../../../application/coupon/CouponValidator.js";

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

import {config} from "../../../config.js";

const registerApplicationServices = (container: Container): void => {
    // NOTIFICATIONS
    //=======================
    container.register({
        token: EmailNotificationService
    }, [
        IEmailProvider,
        TemplateService,
        new URL(config.server.passwordResetUrl, config.server.clientUrl).toString()
    ]);

    // CATEGORY
    //=======================
    container.register({
        token: CategoryService
    }, [
        ICategoryRepository,
        CategoryImageManager
    ]);

    // PRODUCT
    //=======================
    container.register({
        token: ProductService
    }, [
        IProductRepository,
        CategoryService,
        ProductCacheRepository,
        ProductImageManager,
        config.business.product.recommendationsInCartSize
    ]);

    container.register({
        token: ProductStatsService
    }, [
        IProductRepository
    ]);

    // CART
    //=======================
    container.register({
        token: CartService
    }, [
        ICartRepository,
        ProductService
    ]);

    // USER
    //=======================
    container.register({
        token: UserService
    }, [
        IUserRepository,
        PasswordService
    ]);

    container.register({
        token: UserStatsService
    }, [
        IUserRepository
    ]);

    container.register({
        token: UserTokenService
    }, [
        IUserRepository,
        PasswordService
    ]);

    container.register({
        token: UserAccountService
    }, [
        UserService,
        UserTokenService,
        PasswordService,
        JwtService,
        EmailNotificationService,
        AuthCacheRepository
    ]);

    // AUTH
    //=======================
    container.register({
        token: SessionAuthService
    }, [
        UserService,
        PasswordService,
        JwtService,
        AuthCacheRepository
    ]);

    // REVIEW
    //=======================
    container.register({
        token: ReviewService
    }, [
        IReviewRepository,
        UserService,
        ProductService,
        ProductStatsService,
        ReviewValidator
    ]);

    // ANALYTICS
    //=======================
    container.register({
        token: AnalyticsService
    }, [
        IOrderRepository,
        IUserRepository,
        IProductRepository
    ]);

    // ORDER
    //=======================
    container.register({
        token: OrderService
    }, [
        IOrderRepository,
        UserService
    ]);

    // COUPON
    //=======================
    container.register({
        token: CouponService
    }, [
        ICouponRepository,
        UserService,
        CouponValidator,
        config.business.coupon.discountPercentage
    ]);

    // CHECKOUT
    //=======================
    container.register({
        token: CheckoutService
    }, [
        IPaymentProvider,
        ProductService,
        OrderService,
        CartService,
        CouponService,
        config.business.coupon.minAmountForGrant
    ]);
}

export default registerApplicationServices;