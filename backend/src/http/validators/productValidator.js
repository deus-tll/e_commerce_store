import Joi from "joi";
import {
	productIdParam,
	categoryIdSchema,
	priceSchema,
	productNameSchema,
	descriptionSchema,
	imagesSchema
} from "./common.joi.js";

/**
 * Joi schema for validating the POST /products request (Create Product).
 */
export const createProductSchema = Joi.object({
	body: Joi.object({
		name: productNameSchema.required().messages({'any.required': 'Product name is required.'}),
		description: descriptionSchema.required().messages({'any.required': 'Product description is required.'}),
		price: priceSchema.required().messages({'any.required': 'Price is required.'}),
		images: imagesSchema.required().messages({'any.required': 'Images object is required.'}),
		categoryId: categoryIdSchema.required().messages({'any.required': 'Category ID is required.'}),
		isFeatured: Joi.boolean().default(false).optional(),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the PATCH /products/:id request (Update Product).
 */
export const updateProductSchema = Joi.object({
	params: Joi.object({
		id: productIdParam,
	}).required().unknown(false),

	body: Joi.object({
		name: productNameSchema.optional(),
		description: descriptionSchema.optional(),
		price: priceSchema.optional(),
		images: imagesSchema.optional(),
		categoryId: categoryIdSchema.optional(),
		isFeatured: Joi.boolean().optional(),
	})
		.min(1)
		.required()
		.unknown(false)
		.messages({
			'object.min': 'At least one field must be provided for update.',
		}),

	query: Joi.object({}).optional(),
});

const emptyParamAndBody = {
	params: Joi.object({}).optional(),
	body: Joi.object({}).optional(),
};

/**
 * Minimal base query schema (Only pagination fields).
 */
const minimalBaseProductsQuerySchema = Joi.object({
	page: Joi.number().integer().min(1).default(1).optional(),
	limit: Joi.number().integer().min(1).max(50).default(10).optional(),
}).unknown(false);

/**
 * Joi schema for validating the GET /products
 * - All filtering and searching fields are OPTIONAL.
 */
export const getAllProductsPublicSchema = Joi.object({
	...emptyParamAndBody,
	query: minimalBaseProductsQuerySchema.keys({
		categorySlug: Joi.string().trim().optional(),
		search: Joi.string().trim().min(1).optional()
	})
		.unknown(false),
});

/**
 * Joi schema for validating the requests that only use the ID parameter.
 */
export const productIdSchema = Joi.object({
	params: Joi.object({
		id: productIdParam,
	}).required().unknown(false),

	body: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});