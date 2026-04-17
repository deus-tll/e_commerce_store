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
		customerDetails: Joi.object({
			fullName: Joi.string().trim().min(2).max(100).required(),
			phone: Joi.string().trim().min(7).max(20).required(),
			address: Joi.string().trim().min(5).max(255).required(),
		}).required(),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});