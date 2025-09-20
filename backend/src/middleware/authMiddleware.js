import jwt from "jsonwebtoken";

import {UserService} from "../services/UserService.js";
import {ForbiddenError, UnauthorizedError} from "../errors/apiErrors.js";

const userService = new UserService();

export const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			throw new UnauthorizedError("No access token provided");
		}

		let decoded;
		try {
			decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
		} catch (jwtError) {
			if (jwtError.name === "JsonWebTokenError") {
				throw new UnauthorizedError("Invalid token");
			}
			if (jwtError.name === "TokenExpiredError") {
				throw new UnauthorizedError("Access token expired");
			}
			throw jwtError;
		}

		const user = await userService.getUserById(decoded.userId, {
			throwIfNotFound: false
		});

		if (!user) {
			throw new UnauthorizedError("User not found");
		}

		req.user = user;

		next();
	}
	catch (error) {
		console.error("Error in protectRoute middleware", error.message);
		next(error);
	}
};

export const adminRoute = async (req, res, next) => {
	if (!req.user) {
		throw new UnauthorizedError("User not authenticated");
	}

	if (req.user.role !== "admin") {
		throw new ForbiddenError("Admin privileges required");
	}

	next();
};

export const requireVerified = (req, res, next) => {
	if (!req.user) {
		throw new UnauthorizedError("User not authenticated");
	}

	if (!req.user.isVerified) {
		throw new ForbiddenError("Email verification required");
	}

	next();
};