import Joi from "joi";

/**
 * Joi schema for validating the POST /coupons/validate request.
 */
export const validateCouponSchema = Joi.object({
	body: Joi.object({
		code: Joi.string()
			.trim()
			.min(14)
			.max(50)
			.required()
			.messages({
				'any.required': 'Coupon code is required.',
				'string.empty': 'Coupon code cannot be empty.',
				'string.min': 'Coupon code must be at least 14 characters long.',
			}),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});