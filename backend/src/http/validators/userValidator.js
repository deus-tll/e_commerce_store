import Joi from "joi";

import {
	userIdParam,
	userRole,
	userNameSchema,
	emailSchema,
	passwordSchema
} from "./common.joi.js";

import {UserRoles} from "../../constants/app.js";

/**
 * Joi schema for validating the POST /users request (User Creation).
 * Checks body for name, email, password, role, and isVerified.
 */
export const createUserSchema = Joi.object({
	body: Joi.object({
		name: userNameSchema.required().messages({'any.required': 'Name is required.'}),
		email: emailSchema.required().messages({'any.required': 'Email is required.'}),
		password: passwordSchema.required().messages({'any.required': 'Password is required.'}),

		role: userRole.default(UserRoles.CUSTOMER),

		isVerified: Joi.boolean()
			.default(false)
			.messages({
				'boolean.base': 'isVerified must be a boolean value.'
			}),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the GET /users/:userId request (Get By ID)
 * and DELETE /users/:userId request (Delete User).
 * Checks only params for userId.
 */
export const userIdParamSchema = Joi.object({
	params: Joi.object({
		userId: userIdParam,
	}).required().unknown(false),

	body: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the PATCH /users/:userId request (User Update).
 * Checks params for userId and body for optional name, email, role, isVerified.
 */
export const updateUserSchema = Joi.object({
	params: Joi.object({
		userId: userIdParam,
	}).required().unknown(false),

	body: Joi.object({
		name: userNameSchema.optional(),
		email: emailSchema.optional(),
		role: userRole.optional(),
		isVerified: Joi.boolean().optional(),
	})
		.min(1)
		.required()
		.unknown(false)
		.messages({
			'object.min': 'At least one valid field (name, email, role, or isVerified) must be provided for update.',
		}),

	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the GET /users request (Get All Users).
 * Checks query for optional page, limit, role, isVerified, and search.
 */
export const getAllUsersSchema = Joi.object({
	params: Joi.object({}).optional(),
	body: Joi.object({}).optional(),

	query: Joi.object({
		page: Joi.number()
			.integer()
			.min(1)
			.default(1)
			.optional()
			.messages({
				'number.base': 'Page must be a number.',
				'number.integer': 'Page must be an integer.',
				'number.min': 'Page must be 1 or greater.'
			}),

		limit: Joi.number()
			.integer()
			.min(1)
			.max(100)
			.default(10)
			.optional()
			.messages({
				'number.base': 'Limit must be a number.',
				'number.integer': 'Limit must be an integer.',
				'number.min': 'Limit must be 1 or greater.',
				'number.max': 'Limit cannot exceed 100.'
			}),

		role: Joi.string()
			.trim()
			.valid(UserRoles.CUSTOMER, UserRoles.ADMIN)
			.optional()
			.messages({
				'any.only': `Role filter must be one of: ${UserRoles.CUSTOMER}, ${UserRoles.ADMIN}.`
			}),

		isVerified: Joi.boolean()
			.truthy('true')
			.falsy('false')
			.optional(),

		search: Joi.string()
			.trim()
			.min(1)
			.optional(),

	}).unknown(false),
});