import {CartMapper} from "../../../services/cart/CartMapper.js";
import {CategoryMapper} from "../../../services/category/CategoryMapper.js";
import {CouponMapper} from "../../../services/coupon/CouponMapper.js";
import {OrderMapper} from "../../../services/order/OrderMapper.js";
import {ProductMapper} from "../../../services/product/ProductMapper.js";
import {ReviewMapper} from "../../../services/review/ReviewMapper.js";
import {UserMapper} from "../../../services/user/UserMapper.js";

import {MapperTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerMappers = (container) => {
    container.register(MapperTypes.CART, CartMapper, []);
    container.register(MapperTypes.CATEGORY, CategoryMapper, []);
    container.register(MapperTypes.COUPON, CouponMapper, []);
    container.register(MapperTypes.ORDER, OrderMapper, []);
    container.register(MapperTypes.PRODUCT, ProductMapper, []);
    container.register(MapperTypes.REVIEW, ReviewMapper, []);
    container.register(MapperTypes.USER, UserMapper, []);
}

export default registerMappers;