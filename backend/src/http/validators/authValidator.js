import Joi from "joi";

import {
	userNameSchema,
	emailSchema,
	passwordSchema,
	verificationCodeSchema
} from "./common.joi.js";

const resetTokenParam = Joi.string()
	.trim()
	.required()
	.messages({
		'any.required': 'Reset token is required in URL parameters.',
		'string.empty': 'Reset token cannot be empty.',
		'string.base': 'Reset token must be a string.'
	});

/**
 * Joi schema for validating the POST /signup request.
 */
export const signupSchema = Joi.object({
	body: Joi.object({
		name: userNameSchema.required().messages({'any.required': 'Name is required.'}),
		email: emailSchema.required().messages({'any.required': 'Email is required.'}),
		password: passwordSchema.required().messages({'any.required': 'Password is required.'}),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the POST /login request.
 */
export const loginSchema = Joi.object({
	body: Joi.object({
		email: emailSchema.required().messages({'any.required': 'Email is required.'}),
		password: passwordSchema.required().messages({'any.required': 'Password is required.'}),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the POST /verify-email request.
 */
export const verifyEmailSchema = Joi.object({
	body: Joi.object({
		code: verificationCodeSchema.required().messages({'any.required': 'Verification code is required.'}),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the POST /forgot-password request.
 */
export const forgotPasswordSchema = Joi.object({
	body: Joi.object({
		email: emailSchema.required().messages({'any.required': 'Email is required.'}),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the POST /reset-password/:token request.
 */
export const resetPasswordSchema = Joi.object({
	params: Joi.object({
		token: resetTokenParam,
	}).required().unknown(false),

	body: Joi.object({
		password: passwordSchema.required().messages({'any.required': 'Password is required.'}),
	}).required().unknown(false),

	query: Joi.object({}).optional(),
});

/**
 * Joi schema for validating the POST /change-password request.
 */
export const changePasswordSchema = Joi.object({
	body: Joi.object({
		currentPassword: passwordSchema.required().messages({'any.required': 'Current password is required.'}),
		// .label() to provide a more specific name in case of validation errors
		newPassword: passwordSchema.required().label('New Password').messages({'any.required': 'New password is required.'}),
	}).required().unknown(false),

	params: Joi.object({}).optional(),
	query: Joi.object({}).optional(),
});