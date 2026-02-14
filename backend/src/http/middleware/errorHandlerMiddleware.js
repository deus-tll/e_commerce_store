import {ApiError} from "../../errors/apiErrors.js";
import {DatabaseError} from "../../errors/databaseErrors.js";
import {DomainValidationError, EntityNotFoundError} from "../../errors/domainErrors.js";

/**
 * @typedef {import('express').ErrorRequestHandler} ErrorRequestHandler
 */

/**
 * Global error handler middleware. It catches errors passed via next(err),
 * checks if they are custom ApiErrors, and sends a standardized JSON response.
 * @type {ErrorRequestHandler}
 */
const errorHandler = (err, req, res, next) => {
	if (err instanceof DatabaseError) {
		console.error("Critical Database Error:", {
			message: err.message,
			original: err.originalError?.message || err.originalError,
			stack: err.stack
		});
	}
	else if (!(
		err instanceof ApiError ||
		err instanceof EntityNotFoundError ||
		err instanceof DomainValidationError)) {
		console.error("Unhandled Runtime Error:", err);
	}

	if (err instanceof EntityNotFoundError) {
		return res.status(404).json({
			message: err.message,
			status: 404
		});
	}

	if (err instanceof DomainValidationError) {
		const statusMap = {
			"EXPIRED": 410,
			"BAD_REQUEST": 400
		};

		const status = statusMap[err.type] || 400;

		return res.status(status).json({
			message: err.message,
			status: status
		});
	}

	if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            status: err.status,
            code: err.code || null
        });
	}

	if (err instanceof DatabaseError) {
		return res.status(500).json({
			message: "A database error occurred",
			status: 500
		});
	}

	return res.status(500).json({
		message: "Internal Server Error",
        status: 500
	});
}

export default errorHandler;