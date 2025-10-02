import {AccountNotVerifiedError, ForbiddenError, InvalidTokenError, UnauthorizedError} from "../errors/apiErrors.js";
import container from "../config/dependencyContainer.js";

/**
 * @typedef {import('../interfaces/IAuthService.js').IAuthService} IAuthService
 */

/**
 * A factory that creates the 'protectRoute' middleware, injecting dependencies.
 * @param {IAuthService} authService - Injected authentication service.
 * @returns {function} - Middleware function Express.
 */
export const createProtectRoute = (authService) => {
	return async (req, res, next) => {
		try {
			const accessToken = req.cookies.accessToken ||
				(req.headers.authorization && req.headers.authorization.split(' ')[1]);

			if (!accessToken) {
				throw new InvalidTokenError("No access token provided");
			}

			const { userId, user } = await authService.validateAccessToken(accessToken);

			req.userId = userId;
			req.user = user;

			next();
		}
		catch (error) {
			console.error("Error in protectRoute middleware", error.message);
			next(error);
		}
	}
}


// const authService = container.get("IAuthService");

export const protectRoute = async (req, res, next) => {
	// try {
	// 	const accessToken = req.cookies.accessToken ||
	// 		(req.headers.authorization && req.headers.authorization.split(' ')[1]);
	//
	// 	if (!accessToken) {
	// 		throw new InvalidTokenError("No access token provided");
	// 	}
	//
	// 	const { userId, user } = await authService.validateAccessToken(accessToken);
	//
	// 	req.userId = userId;
	// 	req.user = user;
	//
	// 	next();
	// }
	// catch (error) {
	// 	console.error("Error in protectRoute middleware", error.message);
	// 	next(error);
	// }
};

export const adminRoute = async (req, res, next) => {
	try {
		if (!req.user) {
			throw new InvalidTokenError("Authentication required");
		}

		if (req.user.role !== "admin") {
			throw new ForbiddenError("Admin privileges required");
		}

		next();
	}
	catch (error) {
		next(error);
	}
};

export const requireVerified = (req, res, next) => {
	try {
		if (!req.user) {
			throw new UnauthorizedError("Authentication required");
		}

		if (!req.user.isVerified) {
			throw new AccountNotVerifiedError("Email verification required");
		}

		next();
	}
	catch (error) {
		next(error);
	}
};