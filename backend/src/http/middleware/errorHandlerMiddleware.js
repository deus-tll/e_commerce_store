import {
	DomainError,
	ActionNotAllowedError,
	DomainValidationError,
	EntityAlreadyExistsError,
	EntityNotFoundError,
	SystemError,
	UnauthenticatedError,
	UnauthorizedError
} from "../../errors/index.js";

import {config} from "../../config.js";
import {EnvModes} from "../../constants/app.js";
import {ValidationErrorTypes} from "../../constants/errors.js";

/**
 * @typedef {import('express').ErrorRequestHandler} ErrorRequestHandler
 */

/**
 * Global error handler middleware. It catches errors passed via next(err),
 * checks if they are custom ApiErrors, and sends a standardized JSON response.
 * @type {ErrorRequestHandler}
 */
const errorHandler = (err, req, res, _next) => {
	const isProduction = config.nodeEnv === EnvModes.PROD;

	if (!(err instanceof DomainError) || err instanceof SystemError) {
		console.error("[Runtime/System Error]:", err);
	}

	// 2. Resource Errors (404, 409)
	if (err instanceof EntityNotFoundError) {
		return res.status(404).json({ message: err.message, status: 404 });
	}

	if (err instanceof EntityAlreadyExistsError) {
		return res.status(409).json({ message: err.message, status: 409 });
	}

	// 3. Validation Errors (400, 410)
	if (err instanceof DomainValidationError) {
		const statusMap = {
			[ValidationErrorTypes.EXPIRED]: 410,
			[ValidationErrorTypes.BAD_REQUEST]: 400
		};

		const status = statusMap[err.type] || 400;
		return res.status(status).json({ message: err.message, status: status });
	}

	// 4. Security Errors (401, 403)
	if (err instanceof UnauthenticatedError) {
		return res.status(401).json({
			message: err.message,
			status: 401,
			code: err.code || null
		});
	}

	if (err instanceof UnauthorizedError || err instanceof ActionNotAllowedError) {
		return res.status(403).json({
			message: err.message,
			status: 403,
			code: err.code || null
		});
	}

	return res.status(500).json({
		message: isProduction ? "Internal Server Error" : err.message,
		status: 500
	});
}

export default errorHandler;