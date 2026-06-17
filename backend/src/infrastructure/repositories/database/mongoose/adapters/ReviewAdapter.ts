import {IReviewDoc} from "../models/Review.js";
import {ReviewEntity} from "../../../../../entities/review/ReviewEntity.js";
import {normalizePersistence} from "../utils.js";

export class ReviewAdapter {
    static toEntity(doc?: IReviewDoc): ReviewEntity | null {
        const data = normalizePersistence(doc);
        if (!data) return null;

        const { product, user, ...rest } = data;

        return new ReviewEntity({
            ...rest,
            productId: product?.toString(),
            userId: user?.toString()
        });
    }
}