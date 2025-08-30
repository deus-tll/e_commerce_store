import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(401).json({ message: "User not found" });
		}

		req.user = user;

		next();
	}
	catch (error) {
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ message: "Unauthorized - Invalid token" });
		}
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Unauthorized - Access token expired" });
		}

		console.error("Error in protectRoute middleware", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const adminRoute = async (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	}
	else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};