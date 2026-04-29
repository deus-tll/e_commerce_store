import {ReviewValidator} from "../../../services/review/ReviewValidator.js";
import {CouponValidator} from "../../../services/coupon/CouponValidator.js";

import {RepositoryTypes, ValidatorTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerValidators = (container) => {
    container.register(ValidatorTypes.REVIEW, ReviewValidator, [
        RepositoryTypes.PRODUCT,
        RepositoryTypes.USER,
        RepositoryTypes.REVIEW,
        RepositoryTypes.ORDER
    ]);
    container.register(ValidatorTypes.COUPON, CouponValidator, [
        RepositoryTypes.COUPON
    ]);
}

export default registerValidators;