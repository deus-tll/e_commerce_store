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

import {ApplicationServiceTypes, ControllerTypes, CookieManagerTypes, ServiceTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerControllers = (container) => {
    container.register(ControllerTypes.ANALYTICS, AnalyticsController, [ApplicationServiceTypes.ANALYTICS]);
    container.register(ControllerTypes.AUTH, AuthController, [ApplicationServiceTypes.SESSION_AUTH, ApplicationServiceTypes.USER_ACCOUNT, CookieManagerTypes.AUTH]);
    container.register(ControllerTypes.CART, CartController, [ApplicationServiceTypes.CART]);
    container.register(ControllerTypes.CATEGORY, CategoryController, [ApplicationServiceTypes.CATEGORY]);
    container.register(ControllerTypes.COUPON, CouponController, [ServiceTypes.COUPON]);
    container.register(ControllerTypes.ORDER, OrderController, [ServiceTypes.ORDER]);
    container.register(ControllerTypes.PAYMENT, PaymentController, [ServiceTypes.CHECKOUT]);
    container.register(ControllerTypes.PRODUCT, ProductController, [ApplicationServiceTypes.PRODUCT, ApplicationServiceTypes.CART]);
    container.register(ControllerTypes.REVIEW, ReviewController, [ApplicationServiceTypes.REVIEW]);
    container.register(ControllerTypes.USER, UserController, [ApplicationServiceTypes.USER, ApplicationServiceTypes.USER_STATS]);
}

export default registerControllers;