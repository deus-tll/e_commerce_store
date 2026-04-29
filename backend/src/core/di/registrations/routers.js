import {createAuthRouter} from "../../../http/routers/authRouterFactory.js";
import {createAnalyticsRouter} from "../../../http/routers/analyticsRouterFactory.js";
import {createCartRouter} from "../../../http/routers/cartRouterFactory.js";
import {createCategoriesRouter} from "../../../http/routers/categoriesRouterFactory.js";
import {createCouponsRouter} from "../../../http/routers/couponsRouterFactory.js";
import {createOrdersRouter} from "../../../http/routers/ordersRouterFactory.js";
import {createPaymentsRouter} from "../../../http/routers/paymentsRouterFactory.js";
import {createPaymentsWebhookRouter} from "../../../http/routers/paymentsWebhookRouterFactory.js";
import {createProductsRouter} from "../../../http/routers/productsRouterFactory.js";
import {createReviewsRouter} from "../../../http/routers/reviewsRouterFactory.js";
import {createUsersRouter} from "../../../http/routers/usersRouterFactory.js";

import {ControllerTypes, RouterTypes, ServiceTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerRouters = (container) => {
    container.register(RouterTypes.AUTH, (c) => {
        const authController = c.get(ControllerTypes.AUTH);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createAuthRouter(authController, sessionAuthService);
    });
    container.register(RouterTypes.ANALYTICS, (c) => {
        const analyticsController = c.get(ControllerTypes.ANALYTICS);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createAnalyticsRouter(analyticsController, sessionAuthService);
    });
    container.register(RouterTypes.CART, (c) => {
        const cartController = c.get(ControllerTypes.CART);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createCartRouter(cartController, sessionAuthService);
    });
    container.register(RouterTypes.CATEGORY, (c) => {
        const categoryController = c.get(ControllerTypes.CATEGORY);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createCategoriesRouter(categoryController, sessionAuthService);
    });
    container.register(RouterTypes.COUPON, (c) => {
        const couponController = c.get(ControllerTypes.COUPON);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createCouponsRouter(couponController, sessionAuthService);
    });
    container.register(RouterTypes.ORDER, (c) => {
        const orderController = c.get(ControllerTypes.ORDER);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createOrdersRouter(orderController, sessionAuthService);
    });
    container.register(RouterTypes.PAYMENT, (c) => {
        const paymentController = c.get(ControllerTypes.PAYMENT);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createPaymentsRouter(paymentController, sessionAuthService);
    });
    container.register(RouterTypes.PAYMENT_WEBHOOK, (c) => {
        const paymentController = c.get(ControllerTypes.PAYMENT);
        return createPaymentsWebhookRouter(paymentController);
    });
    container.register(RouterTypes.PRODUCT, (c) => {
        const productController = c.get(ControllerTypes.PRODUCT);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createProductsRouter(productController, sessionAuthService);
    });
    container.register(RouterTypes.REVIEW, (c) => {
        const reviewController = c.get(ControllerTypes.REVIEW);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createReviewsRouter(reviewController, sessionAuthService);
    });
    container.register(RouterTypes.USER, (c) => {
        const userController = c.get(ControllerTypes.USER);
        const sessionAuthService = c.get(ServiceTypes.SESSION_AUTH);

        return createUsersRouter(userController, sessionAuthService);
    });
}

export default registerRouters;