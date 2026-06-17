import {Request, Response, NextFunction, RequestHandler} from "express";
import {ObjectSchema} from "joi";

import {ValidationError} from "../../errors/index.js";

/**
 * Creates an Express middleware function that validates the request object
 * (params, body, query) against a Joi schema.
 */
export const validationMiddleware = (schema: ObjectSchema): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction) => {
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
			throw new ValidationError(`Validation Failed: ${messages}`);
		}

		const propertiesToUpdate = ["body", "query", "params"] as const;

		propertiesToUpdate.forEach(prop => {
			if (value[prop]) {
				Object.defineProperty(req, prop, {
					value: value[prop],
					writable: true,
					enumerable: true,
					configurable: true
				});
			}
		});

		next();
	}
}