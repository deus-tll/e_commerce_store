import {AnalyticsController} from "../../../controllers/AnalyticsController.js";
import {AuthController} from "../../../controllers/AuthController.js";
import {CartController} from "../../../controllers/CartController.js";
import {CategoryController} from "../../../controllers/CategoryController.js";
import {CouponController} from "../../../controllers/CouponController.js";
import {OrderController} from "../../../controllers/OrderController.js";
import {PaymentController} from "../../../controllers/PaymentController.js";
import {ProductController} from "../../../controllers/ProductController.js";
import {ReviewController} from "../../../controllers/ReviewController.js";
import {UserController} from "../../../controllers/UserController.js";

import {ControllerTypes, CookieManagerTypes, ServiceTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerControllers = (container) => {
    container.register(ControllerTypes.ANALYTICS, AnalyticsController, [ServiceTypes.ANALYTICS]);
    container.register(ControllerTypes.AUTH, AuthController, [ServiceTypes.SESSION_AUTH, ServiceTypes.USER_ACCOUNT, CookieManagerTypes.AUTH]);
    container.register(ControllerTypes.CART, CartController, [ServiceTypes.CART]);
    container.register(ControllerTypes.CATEGORY, CategoryController, [ServiceTypes.CATEGORY]);
    container.register(ControllerTypes.COUPON, CouponController, [ServiceTypes.COUPON]);
    container.register(ControllerTypes.ORDER, OrderController, [ServiceTypes.ORDER]);
    container.register(ControllerTypes.PAYMENT, PaymentController, [ServiceTypes.CHECKOUT]);
    container.register(ControllerTypes.PRODUCT, ProductController, [ServiceTypes.PRODUCT, ServiceTypes.CART]);
    container.register(ControllerTypes.REVIEW, ReviewController, [ServiceTypes.REVIEW]);
    container.register(ControllerTypes.USER, UserController, [ServiceTypes.USER, ServiceTypes.USER_STATS]);
}

export default registerControllers;