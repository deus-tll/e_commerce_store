import { BadRequestError } from "../../errors/apiErrors.js";

/**
 * Creates an Express middleware function that validates the request object
 * (params, body, query) against a Joi schema.
 *
 * It uses Joi's abortEarly: false option to capture all validation errors at once.
 *
 * @param {import('joi').ObjectSchema} schema - The Joi schema to validate against.
 * @returns {import('express').RequestHandler} - The Express middleware function.
 */
export const validationMiddleware = (schema) => (req, res, next) => {
	const validationTarget = {
		body: req.body,
		params: req.params,
		query: req.query,
	};

	const { error, value } = schema.validate(validationTarget, {
		abortEarly: false, // Return all errors instead of stopping at the first one
		allowUnknown: true, // Allow unknown keys in the request data (unless explicitly forbidden in the schema)
		stripUnknown: true, // Remove keys that are not defined in the schema
	});

	if (error) {
		const messages = error.details.map(detail => detail.message);
		throw new BadRequestError(`Validation Failed: ${messages.join("; ")}`);
	}

	req.body = value.body || req.body;
	req.params = value.params || req.params;
	req.query = value.query || req.query;

	next();
}