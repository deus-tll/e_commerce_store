import {ReviewEntity} from "../../entities/review/ReviewEntity.js";
import {ShortUserDTO} from "./user.js";
import {PaginationMetadata} from "./shared.js";

// INPUT DATA STRUCTURES
//=======================

export interface ReviewCreateInput {
    rating: number;
    comment: string;
}

export type ReviewUpdateInput = Partial<ReviewCreateInput>;

export interface ReviewFiltersPersistence {
    productId?: string;
}

export type ReviewCreatePersistence = ReviewCreateInput;

export type ReviewUpdatePersistence = ReviewUpdateInput;

// OUTPUT DATA STRUCTURES
//=======================

export class ReviewDTO {
    public readonly id: string;
    public readonly productId: string;
    public readonly user: ShortUserDTO;
    public readonly rating: number;
    public readonly comment: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(entity: ReviewEntity, userShortDTO: ShortUserDTO) {
        this.id = entity.id;
        this.productId = entity.productId;
        this.user = userShortDTO;
        this.rating = entity.rating;
        this.comment = entity.comment;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;

        Object.freeze(this);
    }
}

export class ReviewPaginationResultDTO {
    public readonly reviews: readonly ReviewDTO[];
    public readonly pagination: PaginationMetadata;

    constructor(reviews: readonly ReviewDTO[], pagination: PaginationMetadata) {
        this.reviews = Object.freeze([...reviews]);
        this.pagination = pagination;

        Object.freeze(this);
    }
}