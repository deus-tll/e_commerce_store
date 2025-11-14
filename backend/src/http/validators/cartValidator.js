import Joi from "joi";
import { productIdParam } from "./common.joi.js";

/**
 * Joi schema for validating the POST /cart request (Add Product).
 */
export const addProductSchema = Joi.object({
	body: Joi.object({
		productId: productIdParam.messages({
			'any.required': 'Product ID is required in the request body.',
		}),
		quantity: Joi.number()
			.integer()
			.min(1)
			.default(1)
			.optional()
			.messages({
				'number.base': 'Quantity must be a number.',
				'number.integer': 'Quantity must be an integer.',
				'number.min': 'Quantity must be 1 or greater.',
			}),
	}).required().unknown(false)
});

/**
 * Joi schema for validating the DELETE /cart/:productId request (Remove single product).
 */
export const removeProductSchema = Joi.object({
	params: Joi.object({
		productId: productIdParam,
	}).required().unknown(false)
});

/**
 * Joi schema for validating the PATCH /cart/:productId request (Update quantity).
 */
export const updateProductQuantitySchema = Joi.object({
	params: Joi.object({
		productId: productIdParam,
	}).required().unknown(false),

	body: Joi.object({
		quantity: Joi.number()
			.integer()
			.min(0)
			.required()
			.messages({
				'any.required': 'Quantity is required.',
				'number.base': 'Quantity must be a number.',
				'number.integer': 'Quantity must be an integer.',
				'number.min': 'Quantity must be 0 or greater.',
			}),
	}).min(1).required().unknown(false)
});

