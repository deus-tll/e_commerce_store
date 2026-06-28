import Joi from "joi";

export const imageSchema = Joi.string().trim().uri().messages({
	'string.uri': 'Image must be a valid URL.'
});

export const userNameSchema = Joi.string()
	.trim()
	.min(2)
	.max(100)
	.messages({
		'string.empty': 'Name cannot be empty.',
		'string.min': 'Name must be at least 2 characters long.',
		'string.max': 'Name cannot exceed 100 characters.'
	});

export const emailSchema = Joi.string()
	.trim()
	.email()
	.messages({
		'string.empty': 'Email cannot be empty.',
		'string.email': 'Email must be a valid email address.'
	});

export const passwordSchema = Joi.string()
	.min(6)
	.messages({
		'string.empty': 'Password cannot be empty.',
		'string.min': 'Password must be at least 6 characters long.'
	});

export const productIdParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Product ID is required in URL parameters.',
		'string.empty': 'Product ID cannot be empty.',
		'string.base': 'Product ID must be a string.'
	});

export const emptyParamAndBody = {
	params: Joi.object({}).optional(),
	body: Joi.object({}).optional(),
};