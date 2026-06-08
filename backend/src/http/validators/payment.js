import Joi from "joi";

const checkoutItemSchema = Joi.object({
	id: Joi.string()
		.trim()
		.required()
		.messages({
			'any.required': 'Item ID is required for each item.',
			'string.empty': 'Item ID cannot be empty.',
		}),
	quantity: Joi.number()
		.integer()
		.min(1)
		.default(1)
		.messages({
			'number.base': 'Quantity must be a number.',
			'number.integer': 'Quantity must be an integer.',
			'number.min': 'Quantity must be 1 or greater.',
		}),
}).required().unknown(false);

export const createCheckoutSessionSchema = Joi.object({
	body: Joi.object({
		items: Joi.array()
			.items(checkoutItemSchema)
			.min(1)
			.required()
			.messages({
				'array.base': 'Items must be an array.',
				'array.min': 'Item array cannot be empty.',
				'any.required': 'Item array is required.',
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