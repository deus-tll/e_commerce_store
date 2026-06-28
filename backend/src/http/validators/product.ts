import Joi from "joi";
import {
	productIdParam,
	emptyParamAndBody,
	imageSchema
} from "./common.js";

const nameSchema = Joi.string()
	.trim()
	.min(1)
	.max(255)
	.messages({
		'string.empty': 'Product name cannot be empty.',
		'string.base': 'Product name must be a string.'
	});

const descriptionSchema = Joi.string()
	.trim()
	.min(1)
	.max(2000)
	.messages({
		'string.empty': 'Product description cannot be empty.',
		'string.base': 'Product description must be a string.'
	});

const priceSchema = Joi.number()
	.precision(2)
	.strict()
	.min(0.01)
	.messages({
		'number.base': 'Price must be a number.',
		'number.min': 'Price must be greater than zero.',
		'number.precision': 'Price can have a maximum of two decimal places.'
	});

const stockSchema = Joi.number()
	.integer()
	.min(0)
	.messages({
		'number.base': 'Stock must be a number.',
		'number.integer': 'Stock must be an integer.',
		'number.min': 'Stock cannot be negative.'
	});

const categoryIdSchema = Joi.string()
	.trim()
	.min(1)
	.messages({
		'string.empty': 'Category ID cannot be empty.',
		'string.base': 'Category ID must be a string.'
	});

const createProductImagesSchema = Joi.object({
	mainImage: imageSchema.required().messages({
		'any.required': 'Main image URL is required.'
	}),
	additionalImages: Joi.array().items(imageSchema)
		.default([])
		.messages({
			'array.base': 'Additional images must be an array of URLs.'
		}),
}).messages({
	'object.base': 'Images must be a valid object.',
});

const updateProductImagesSchema = Joi.object({
	mainImage: imageSchema.optional(),
	additionalImages: Joi.array().items(imageSchema).optional(),
}).messages({
	'object.base': 'Images must be a valid object.',
});

const attributeItemSchema = Joi.object({
	name: Joi.string().trim().min(1).required().messages({
		'any.required': 'Attribute name is required.',
		'string.empty': 'Attribute name cannot be empty.'
	}),
	value: Joi.string().trim().min(1).required().messages({
		'any.required': 'Attribute value is required.',
		'string.empty': 'Attribute value cannot be empty.'
	})
});

/**
 * Joi schema for validating the POST /products request (Create Product).
 */
export const createProductSchema = Joi.object({
	body: Joi.object({
		name: nameSchema.required().messages({'any.required': 'Product name is required.'}),
		description: descriptionSchema.required().messages({'any.required': 'Product description is required.'}),
		price: priceSchema.required().messages({'any.required': 'Price is required.'}),
		stock: stockSchema.required().messages({'any.required': 'Stock quantity is required.'}),
		images: createProductImagesSchema.required().messages({'any.required': 'Images object is required.'}),
		categoryId: categoryIdSchema.required().messages({'any.required': 'Category ID is required.'}),
		attributes: Joi.array().items(attributeItemSchema).optional().default([]),
		isFeatured: Joi.boolean().default(false).optional()
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
		name: nameSchema.optional(),
		description: descriptionSchema.optional(),
		price: priceSchema.optional(),
		stock: stockSchema.optional(),
		images: updateProductImagesSchema.optional(),
		categoryId: categoryIdSchema.optional(),
		attributes: Joi.array().items(attributeItemSchema).optional(),
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

/**
 * Minimal base query schema (Only pagination fields).
 */
const minimalBaseProductsQuerySchema = Joi.object({
	page: Joi.number().integer().min(1).default(1).optional(),
	limit: Joi.number().integer().min(1).max(50).default(10).optional(),
}).unknown(false);

/**
 * Joi schema for validating the GET /products
 * - Supports multi-select attributes (OR logic) and dynamic sorting.
 */
export const getAllProductsPublicSchema = Joi.object({
	...emptyParamAndBody,
	query: minimalBaseProductsQuerySchema.keys({
		categorySlug: Joi.string().trim().optional(),
		search: Joi.string().trim().min(1).optional(),
		attributes: Joi.object().pattern(
			Joi.string(),
			Joi.alternatives().try(
				Joi.string().trim(),
				Joi.array().items(Joi.string().trim())
			)
		).optional(),
		sortBy: Joi.string()
			.valid('price', 'createdAt', 'name', 'ratingStats.averageRating')
			.default('createdAt')
			.optional(),
		order: Joi.string().valid('asc', 'desc').default('desc').optional()
	})
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