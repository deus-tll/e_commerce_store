import {Container} from "../Container.js";

import {IProductRepository} from "../../../application/product/IProductRepository.js";
import {IUserRepository} from "../../../application/user/IUserRepository.js";
import {IReviewRepository} from "../../../application/review/IReviewRepository.js";
import {IOrderRepository} from "../../../application/order/IOrderRepository.js";
import {ICouponRepository} from "../../../application/coupon/ICouponRepository.js";

import {ReviewValidator} from "../../../application/review/ReviewValidator.js";
import {CouponValidator} from "../../../application/coupon/CouponValidator.js";

import {config} from "../../../config.js";

const registerValidators = (container: Container): void => {
    container.register({
        token: ReviewValidator
    }, [
        IProductRepository,
        IUserRepository,
        IReviewRepository,
        IOrderRepository,
        config.business.review.requirePurchaseForReview
    ]);

    container.register({
        token: CouponValidator
    }, [
        ICouponRepository,
    ]);
}

export default registerValidators;