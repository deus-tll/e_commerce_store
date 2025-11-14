import Joi from "joi";

import {
	productIdParam,
	reviewIdParam,
	reviewRatingSchema,
	reviewCommentSchema
} from "./common.joi.js";

/**
 * Joi schema for validating the POST /reviews/product/:id request (Create Review).
 */
export const createReviewSchema = Joi.object({
	params: Joi.object({
		id: productIdParam, // The product ID is aliased as 'id' in the route
	}).required().unknown(false),

	body: Joi.object({
		rating: reviewRatingSchema.required().messages({'any.required': 'Rating is required.'}),
		comment: reviewCommentSchema.required().messages({'any.required': 'Comment is required.'}),
	}).required().unknown(false),

	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the PATCH /reviews/:reviewId request (Update Review).
 */
export const updateReviewSchema = Joi.object({
	params: Joi.object({
		reviewId: reviewIdParam,
	}).required().unknown(false),

	body: Joi.object({
		rating: reviewRatingSchema.optional(),
		comment: reviewCommentSchema.optional(),
	})
		.min(1)
		.required()
		.unknown(false)
		.messages({
			'object.min': 'At least one field (rating or comment) must be provided for update.',
		}),

	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the GET /reviews/product/:id request (Get Reviews By Product).
 */
export const getReviewsByProductSchema = Joi.object({
	params: Joi.object({
		id: productIdParam, // The product ID is aliased as 'id' in the route
	}).required().unknown(false),

	body: Joi.object({}).optional(),

	query: Joi.object({
		page: Joi.number().integer().min(1).default(1).optional(),
		limit: Joi.number().integer().min(1).max(50).default(10).optional(),
	}).unknown(false),
});

/**
 * Joi schema for validating the DELETE /reviews/:reviewId request (Delete Review).
 */
export const deleteReviewSchema = Joi.object({
	params: Joi.object({
		reviewId: reviewIdParam,
	}).required().unknown(false),

	body: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});