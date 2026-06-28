import {Request, Response, NextFunction, RequestHandler} from "express";
import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {InvalidTokenError, UnauthenticatedError, AccountNotVerifiedError, ForbiddenError} from "../../errors/index.js"
import {UserRole} from "../../enums/application.js";

export const createProtectRoute = (authService: SessionAuthService) : RequestHandler => {
	return async (req: Request, _: Response, next: NextFunction) => {
		const accessToken = req.cookies?.accessToken;

		if (!accessToken) {
			throw new InvalidTokenError("No access token provided");
		}

		req.user = await authService.validateAccessToken(accessToken);

		next();
	}
}

export const adminRoute: RequestHandler = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
	if (!req.user) {
		throw new UnauthenticatedError("Authentication required");
	}

	if (req.user.role !== UserRole.ADMIN) {
		throw new ForbiddenError("Admin privileges required");
	}

	next();
};

export const requireVerified = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
	if (!req.user) {
		throw new UnauthenticatedError("Authentication required");
	}

	if (!req.user.isVerified) {
		throw new AccountNotVerifiedError("Email verification required");
	}

	next();
};