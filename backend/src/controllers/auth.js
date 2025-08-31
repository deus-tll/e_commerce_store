import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { redis } from "../config/redis.js";

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m"
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d"
	});

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7*24*60*60);
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000
	});
};

export const signup = async (req, res) => {
	try {
		const { name, email, password } = req.body;
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = await User.create({ name, email, password });

		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);

		setCookies(res, accessToken, refreshToken);

		const newUser = {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role
		};

		return res.status(201).json(newUser);
	}
	catch (error) {
		console.error("Error while performing signup", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select('+password');

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);

			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			const confirmedUser = {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role
			};

			return res.status(200).json(confirmedUser);
		}
		else {
			return res.status(401).json({ message: "Invalid credentials" });
		}
	}
	catch (error) {
		console.error("Error while performing login", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		return res.status(204).end();
	}
	catch (error) {
		console.error("Error while performing logout", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const refreshAccessToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token provided" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000
		});

		return res.status(200).json({ message: "Token refreshed successfully" });
	}
	catch (error) {
		console.error("Error while performing access token refreshing", error.message);
		return res.status(500).json({ message: error.message });
	}
};