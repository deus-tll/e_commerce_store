import Joi from "joi";
import { checkoutProductItemSchema } from "./common.joi.js";

/**
 * Joi schema for validating the POST /create-checkout-session request.
 */
export const createCheckoutSessionSchema = Joi.object({
	body: Joi.object({
		products: Joi.array()
			.items(checkoutProductItemSchema)
			.min(1)
			.required()
			.messages({
				'array.base': 'Products must be an array.',
				'array.min': 'Product list cannot be empty.',
				'any.required': 'Product list is required.',
			}),

		couponCode: Joi.string().trim().min(1).optional().allow(null, ""),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the POST /checkout-success request.
 */
export const checkoutSuccessSchema = Joi.object({
	body: Joi.object({
		sessionId: Joi.string()
			.trim()
			.required()
			.messages({
				'any.required': 'Session ID is required.',
				'string.empty': 'Session ID cannot be empty.',
			}),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});