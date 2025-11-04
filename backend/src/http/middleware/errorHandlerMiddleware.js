import { ApiError } from "../../errors/apiErrors.js";

/**
 * @typedef {import('express').ErrorRequestHandler} ErrorRequestHandler
 */

/**
 * Global error handler middleware. It catches errors passed via next(err),
 * checks if they are custom ApiErrors, and sends a standardized JSON response.
 * @type {ErrorRequestHandler}
 */
const errorHandler = (err, req, res, next) => {
	console.error("Caught by error handler:", err);

	if (err instanceof ApiError) {
        return res.status(err.status). json({
            message: err.message,
            status: err.status,
            code: err.code || null
        });
	}

	return res.status(500).json({
		message: "Internal Server Error",
        status: 500
	});
}

export default errorHandler;