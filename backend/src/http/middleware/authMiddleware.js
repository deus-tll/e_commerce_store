import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {InvalidTokenError, UnauthenticatedError, AccountNotVerifiedError, ForbiddenError} from "../../errors/index.js"

/**
 * A factory that creates the 'protectRoute' middleware, injecting dependencies.
 * @param {ISessionAuthService} authService - Injected authentication service.
 * @returns {function} - Middleware function Express.
 */
export const createProtectRoute = (authService) => {
	return async (req, res, next) => {
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
}

export const adminRoute = async (req, res, next) => {
	if (!req.user) {
		throw new UnauthenticatedError("Authentication required");
	}

	if (req.user.role !== "admin") {
		throw new ForbiddenError("Admin privileges required");
	}

	next();
};

export const requireVerified = (req, res, next) => {
	if (!req.user) {
		throw new UnauthenticatedError("Authentication required");
	}

	if (!req.user.isVerified) {
		throw new AccountNotVerifiedError("Email verification required");
	}

	next();
};