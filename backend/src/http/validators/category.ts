import Joi from "joi";
import {
	imageSchema, emptyParamAndBody
} from "./common.js";

const categoryIdParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Category ID is required in URL parameters.',
		'string.empty': 'Category ID cannot be empty.',
		'string.base': 'Category ID must be a string.'
	});

const nameSchema = Joi.string()
	.trim()
	.min(1)
	.max(100)
	.messages({
		'string.empty': 'Category name cannot be empty.',
		'string.base': 'Category name must be a string.'
	});

const allowedAttributesSchema = Joi.array()
	.items(Joi.string().trim().min(1))
	.messages({
		'array.base': 'Allowed attributes must be an array of strings.'
	});

const categorySlugParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Category Slug is required in URL parameters.',
		'string.empty': 'Category Slug cannot be empty.',
		'string.base': 'Category Slug must be a string.'
	});

/**
 * Joi schema for validating the POST /categories request (Create Category).
 */
export const createCategorySchema = Joi.object({
	body: Joi.object({
		name: nameSchema.required().messages({'any.required': 'Category name is required.'}),
		image: imageSchema.required().messages({'any.required': 'Category image URL is required.'}),
		allowedAttributes: allowedAttributesSchema.default([])
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the PATCH /categories/:id request (Update Category).
 */
export const updateCategorySchema = Joi.object({
	params: Joi.object({
		id: categoryIdParam,
	}).required().unknown(false),

	body: Joi.object({
		name: nameSchema.optional(),
		image: imageSchema.optional(),
		allowedAttributes: allowedAttributesSchema.optional()
	})
		.min(1)
		.required()
		.unknown(false)
		.messages({
			'object.min': 'At least one field must be provided for update.',
		}),

	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the GET/DELETE /categories/:id requests.
 */
export const categoryIdSchema = Joi.object({
	params: Joi.object({
		id: categoryIdParam,
	}).required().unknown(false),

	body: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Minimal base query schema (Only pagination fields).
 */
const minimalBaseCategoriesQuerySchema = Joi.object({
	page: Joi.number().integer().min(1).default(1).optional(),
	limit: Joi.number().integer().min(1).max(50).default(10).optional(),
}).unknown(false);

/**
 * Joi schema for validating the GET /categories request (Get All Categories).
 */
export const getAllCategoriesSchema = Joi.object({
	...emptyParamAndBody,
	query: minimalBaseCategoriesQuerySchema.keys({
		search: Joi.string().trim().min(1).optional()
	})
});

/**
 * Joi schema for validating the requests that only use the ID parameter.
 */
export const categorySlugSchema = Joi.object({
	params: Joi.object({
		slug: categorySlugParam,
	}).required().unknown(false),

	body: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});