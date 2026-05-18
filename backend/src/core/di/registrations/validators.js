import {ReviewValidator} from "../../../services/review/ReviewValidator.js";
import {CouponValidator} from "../../../services/coupon/CouponValidator.js";

import {DatabaseRepositoryTypes, ValidatorTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerValidators = (container) => {
    container.register(ValidatorTypes.REVIEW, ReviewValidator, [
        DatabaseRepositoryTypes.PRODUCT,
        DatabaseRepositoryTypes.USER,
        DatabaseRepositoryTypes.REVIEW,
        DatabaseRepositoryTypes.ORDER
    ]);
    container.register(ValidatorTypes.COUPON, CouponValidator, [
        DatabaseRepositoryTypes.COUPON
    ]);
}

export default registerValidators;