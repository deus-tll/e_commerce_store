import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { redis } from "../config/redis.js";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../errors/apiErrors.js";

export class AuthService {
	#generateTokens(userId) {
		const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "15m"
		});

		const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: "7d"
		});

		return { accessToken, refreshToken };
	}

	async #storeRefreshToken(userId, refreshToken) {
		await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
	}

	async signup(name, email, password) {
		const userExists = await User.findOne({ email });
		if (userExists) {
			throw new BadRequestError("User already exists");
		}

		const user = await User.create({ name, email, password });
		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		return {
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role
			},
			tokens: { accessToken, refreshToken }
		};
	}

	async login(email, password) {
		const user = await User.findOne({ email }).select('+password');
		if (!user || !(await user.comparePassword(password))) {
			throw new UnauthorizedError("Invalid credentials");
		}

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		return {
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role
			},
			tokens: { accessToken, refreshToken }
		};
	}

	async logout(refreshToken) {
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}
	}

	async getProfile(userId) {
		const user = await User.findById(userId);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		return {
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role
		};
	}

	async refreshAccessToken(refreshToken) {
		if (!refreshToken) {
			throw new UnauthorizedError("No refresh token provided");
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			throw new UnauthorizedError("Invalid refresh token provided");
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		return { accessToken };
	}
}