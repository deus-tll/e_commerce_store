export class ProductRatingStats {
    public readonly averageRating: number;
    public readonly totalReviews: number;
    public readonly ratingSum: number;

    constructor(data: {
        averageRating?: number;
        totalReviews?: number;
        ratingSum?: number } = {}
    ) {
        this.averageRating = Number(Number(data.averageRating || 0).toFixed(1));
        this.totalReviews = data.totalReviews || 0;
        this.ratingSum = data.ratingSum || 0;

        Object.freeze(this);
    }
}