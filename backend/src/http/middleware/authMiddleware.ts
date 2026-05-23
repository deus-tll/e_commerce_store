import { Request, Response, NextFunction, RequestHandler } from "express";
import {ISessionAuthService} from "../../interfaces/auth/ISessionAuthService.js";

import {InvalidTokenError, UnauthenticatedError, AccountNotVerifiedError, ForbiddenError} from "../../errors/index.js"
import {UserRoles} from "../../constants/app.js";

/**
 * A factory that creates the 'protectRoute' middleware, injecting dependencies.
 * @param {ISessionAuthService} authService - Injected authentication service.
 * @returns {function} - Middleware function Express.
 */
export const createProtectRoute = (authService: ISessionAuthService) : RequestHandler => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.cookies?.accessToken;

		if (!accessToken) {
			throw new InvalidTokenError("No access token provided");
		}

		const { userId, user } = await authService.validateAccessToken(accessToken);

		req.user = user;
		// @ts-ignore
		req.userId = userId;

		next();
	}
}

export const adminRoute: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		throw new UnauthenticatedError("Authentication required");
	}

	if (req.user.role !== UserRoles.ADMIN) {
		throw new ForbiddenError("Admin privileges required");
	}

	next();
};

export const requireVerified = (req: Request, res: Response, next: NextFunction) => {
	if (!req.user) {
		throw new UnauthenticatedError("Authentication required");
	}

	if (!req.user.isVerified) {
		throw new AccountNotVerifiedError("Email verification required");
	}

	next();
};