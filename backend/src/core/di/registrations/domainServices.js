import {OrderService} from "../../../application/order/OrderService.js";
import {CouponService} from "../../../application/coupon/CouponService.js";
import {AnalyticsService} from "../../../application/analytics/AnalyticsService.js";
import {CheckoutService} from "../../../application/checkout/CheckoutService.js";

import {
    DatabaseRepositoryTypes, ProviderTypes, FactoryTypes,
    MapperTypes, ValidatorTypes,
    ServiceTypes, ApplicationServiceTypes
} from "../../../constants/ioc.js";

import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerDomainServices = (container) => {
    // Order
    container.register(ServiceTypes.ORDER, OrderService, [DatabaseRepositoryTypes.ORDER, ApplicationServiceTypes.USER, MapperTypes.ORDER]);
    // =============
    // Coupon
    container.register(ServiceTypes.COUPON, CouponService, [
        DatabaseRepositoryTypes.COUPON,
        ApplicationServiceTypes.USER,
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