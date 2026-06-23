import {IReviewDoc} from "../models/Review.js";
import {ReviewEntity} from "../../../../../entities/review/ReviewEntity.js";
import {normalizePersistence} from "../utils.js";

export class ReviewAdapter {
    private static buildEntity(
        data: ReturnType<typeof normalizePersistence<IReviewDoc>>
    ): ReviewEntity {
        const { product, user, ...rest } = data;

        return new ReviewEntity({
            ...rest,
            productId: product?.toString(),
            userId: user?.toString()
        });
    }

    static toEntity(doc?: IReviewDoc | null): ReviewEntity | null {
        if (!doc) return null;

        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }

    static toEntityRequired(doc: IReviewDoc): ReviewEntity {
        const data = normalizePersistence(doc);
        return this.buildEntity(data);
    }
}