import {ReviewValidator} from "../../../application/review/ReviewValidator.js";
import {CouponValidator} from "../../../application/coupon/CouponValidator.js";

import {DatabaseRepositoryTypes, ValidatorTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerValidators = (container) => {
    container.register(ValidatorTypes.REVIEW, () => {
        const productRepository = container.get(DatabaseRepositoryTypes.PRODUCT);
        const userRepository = container.get(DatabaseRepositoryTypes.USER);
        const reviewRepository = container.get(DatabaseRepositoryTypes.REVIEW);
        const orderRepository = container.get(DatabaseRepositoryTypes.ORDER);
        const requirePurchaseForReview = config.business.review.requirePurchaseForReview;

        return new ReviewValidator(
            productRepository,
            userRepository,
            reviewRepository,
            orderRepository,
            requirePurchaseForReview
        );
    });
    container.register(ValidatorTypes.COUPON, CouponValidator, [
        DatabaseRepositoryTypes.COUPON
    ]);
}

export default registerValidators;