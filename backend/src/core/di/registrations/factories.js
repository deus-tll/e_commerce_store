import {CouponFactory} from "../../../services/coupon/CouponFactory.js";
import {FactoryTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

const DISCOUNT_PERCENTAGE = config.business.coupon.discountPercentage;

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerFactories = (container) => {
    container.register(FactoryTypes.COUPON, () => new CouponFactory(DISCOUNT_PERCENTAGE));
}

export default registerFactories;