import Joi from "joi";

import {
	productIdParam
} from "./common.js";

const reviewIdParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Review ID is required in URL parameters.',
		'string.empty': 'Review ID cannot be empty.',
		'string.base': 'Review ID must be a string.'
	});

const reviewRatingSchema = Joi.number()
	.integer()
	.min(1)
	.max(5)
	.messages({
		'number.base': 'Rating must be a number.',
		'number.integer': 'Rating must be an integer.',
		'number.min': 'Rating must be 1 or greater.',
		'number.max': 'Rating cannot exceed 5.'
	});

export const reviewCommentSchema = Joi.string()
	.trim()
	.min(1)
	.max(500)
	.messages({
		'string.empty': 'Comment cannot be empty.',
		'string.min': 'Comment cannot be empty.',
		'string.base': 'Comment must be a string.',
		'string.max': 'Comment cannot exceed 500 characters.'
	});

/**
 * Joi schema for validating the POST /reviews/product/:id request (Create Review).
 */
export const createReviewSchema = Joi.object({
	params: Joi.object({
		id: productIdParam,
	}).required().unknown(false),

	body: Joi.object({
		rating: reviewRatingSchema.required().messages({'any.required': 'Rating is required.'}),
		comment: reviewCommentSchema.required().messages({'any.required': 'Comment is required.'}),
	}).required().unknown(false),

	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the PATCH /reviews/:id request (Update Review).
 */
export const updateReviewSchema = Joi.object({
	params: Joi.object({
		id: reviewIdParam,
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
		id: productIdParam,
	}).required().unknown(false),

	body: Joi.object({}).optional(),

	query: Joi.object({
		page: Joi.number().integer().min(1).default(1).optional(),
		limit: Joi.number().integer().min(1).max(50).default(10).optional(),
	}).unknown(false),
});

/**
 * Joi schema for validating the DELETE /reviews/:id request (Delete Review).
 */
export const deleteReviewSchema = Joi.object({
	params: Joi.object({
		id: reviewIdParam,
	}).required().unknown(false),

	body: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});