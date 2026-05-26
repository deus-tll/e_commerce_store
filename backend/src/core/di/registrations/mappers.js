import {CartMapper} from "../../../application/cart/CartMapper.js";
import {CouponMapper} from "../../../application/coupon/CouponMapper.js";
import {OrderMapper} from "../../../application/order/OrderMapper.js";
import {ReviewMapper} from "../../../application/review/ReviewMapper.js";
import {UserMapper} from "../../../application/user/UserMapper.js";

import {MapperTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerMappers = (container) => {
    container.register(MapperTypes.CART, CartMapper, []);
    container.register(MapperTypes.COUPON, CouponMapper, []);
    container.register(MapperTypes.ORDER, OrderMapper, []);
    container.register(MapperTypes.REVIEW, ReviewMapper, []);
    container.register(MapperTypes.USER, UserMapper, []);
}

export default registerMappers;