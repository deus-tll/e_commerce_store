import {Container} from "../Container.js";

import {AnalyticsController} from "../../../http/controllers/AnalyticsController.js";
import {AuthController} from "../../../http/controllers/AuthController.js";
import {CartController} from "../../../http/controllers/CartController.js";
import {CategoryController} from "../../../http/controllers/CategoryController.js";
import {CouponController} from "../../../http/controllers/CouponController.js";
import {OrderController} from "../../../http/controllers/OrderController.js";
import {PaymentController} from "../../../http/controllers/PaymentController.js";
import {ProductController} from "../../../http/controllers/ProductController.js";
import {ReviewController} from "../../../http/controllers/ReviewController.js";
import {UserController} from "../../../http/controllers/UserController.js";

import {AnalyticsService} from "../../../application/analytics/AnalyticsService.js";
import {SessionAuthService} from "../../../application/auth/SessionAuthService.js";
import {UserAccountService} from "../../../application/user/UserAccountService.js";
import {AuthCookieManager} from "../../../http/cookies/AuthCookieManager.js";
import {CartService} from "../../../application/cart/CartService.js";
import {CategoryService} from "../../../application/category/CategoryService.js";
import {CouponService} from "../../../application/coupon/CouponService.js";
import {OrderService} from "../../../application/order/OrderService.js";
import {CheckoutService} from "../../../application/checkout/CheckoutService.js";
import {ProductService} from "../../../application/product/ProductService.js";
import {ReviewService} from "../../../application/review/ReviewService.js";
import {UserService} from "../../../application/user/UserService.js";
import {UserStatsService} from "../../../application/user/UserStatsService.js";

const registerControllers = (container: Container): void => {
    container.register({
        token: AnalyticsController
    }, [AnalyticsService]);

    container.register({
        token: AuthController
    }, [SessionAuthService, UserAccountService, AuthCookieManager]);

    container.register({
        token: CartController
    }, [CartService]);

    container.register({
        token: CategoryController
    }, [CategoryService]);

    container.register({
        token: CouponController
    }, [CouponService]);

    container.register({
        token: OrderController
    }, [OrderService]);

    container.register({
        token: PaymentController
    }, [CheckoutService]);

    container.register({
        token: ProductController
    }, [ProductService, CartService]);

    container.register({
        token: ReviewController
    }, [ReviewService]);

    container.register({
        token: UserController
    }, [UserService, UserStatsService]);
}

export default registerControllers;