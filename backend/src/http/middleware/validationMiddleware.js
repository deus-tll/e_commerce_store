import {DomainValidationError} from "../../errors/index.js";

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
		params: req.params || {},
		body: req.body || {},
		query: req.query || {},
	};

	const { error, value } = schema.validate(validationTarget, {
		abortEarly: false, // Return all errors instead of stopping at the first one
		allowUnknown: true, // Allow unknown keys in the request data (unless explicitly forbidden in the schema)
		stripUnknown: true, // Remove keys that are not defined in the schema
	});

	if (error) {
		const messages = error.details.map(detail => detail.message).join("; ");
		throw new DomainValidationError(`Validation Failed: ${messages}`);
	}

	if (value.body) {
		Object.defineProperty(req, 'body', {
			value: value.body,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}
	if (value.query) {
		Object.defineProperty(req, 'query', {
			value: value.query,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}
	if (value.params) {
		Object.defineProperty(req, 'params', {
			value: value.params,
			writable: true,
			enumerable: true,
			configurable: true
		});
	}

	next();
}