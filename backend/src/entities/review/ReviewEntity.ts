export class ReviewEntity {
    public readonly id: string;
    public readonly productId: string;
    public readonly userId: string;
    public readonly rating: number;
    public readonly comment: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(data: {
        id: string;
        productId: string;
        userId: string;
        rating: number;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = data.id;
        this.productId = data.productId;
        this.userId = data.userId;
        this.rating = data.rating;
        this.comment = data.comment;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        Object.freeze(this);
    }
}