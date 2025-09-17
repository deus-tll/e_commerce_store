import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { redis } from "../config/redis.js";
import {EmailService} from "./EmailService.js";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../errors/apiErrors.js";

export class AuthService {
	constructor() {
		this.emailService = new EmailService();
	}

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

		const verificationToken = this.emailService.generateVerificationToken();

		const user = await User.create({
			name, email, password,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
		});

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		await this.emailService.sendVerificationEmail(user.email, verificationToken);

		return {
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
				lastLogin: user.lastLogin
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

		user.lastLogin = new Date();

		await user.save();

		return {
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
				lastLogin: user.lastLogin
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
			role: user.role,
			isVerified: user.isVerified,
			lastLogin: user.lastLogin
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

	async verifyEmail(code) {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() }
		});

		if (!user) {
			throw new BadRequestError("Invalid or expired verification code");
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;

		await user.save();

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		return {
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
				lastLogin: user.lastLogin
			},
			tokens: { accessToken, refreshToken }
		};
	}

	async resendVerificationEmail(userId) {
		const user = await User.findById(userId);

		if (!user) {
			throw new NotFoundError("User not found");
		}

		if (user.isVerified) {
			throw new BadRequestError("Email is already verified");
		}

		const verificationToken = this.emailService.generateVerificationToken();
		user.verificationToken = verificationToken;
		user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

		await user.save();

		await this.emailService.sendVerificationEmail(user.email, verificationToken);

		return { message: "Verification code sent to your email" };
	}

	async forgotPassword(email) {
		const user = await User.findOne({ email });

		if (!user) {
			throw new BadRequestError("User with this email does not exist");
		}

		const resetToken = this.emailService.generateResetToken();
		const resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

		user.resetPasswordToken = resetToken;
		user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;

		await user.save();

		const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

		await this.emailService.sendPasswordResetEmail(email, resetPasswordUrl);

		return {
			message: "Password reset link sent to your email"
		};
	}

	async resetPassword(token, password) {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordTokenExpiresAt: { $gt: Date.now() }
		});

		if (!user) {
			throw new BadRequestError("Invalid or expired reset token");
		}

		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpiresAt = undefined;

		await user.save();

		await this.emailService.sendPasswordResetSuccessEmail(user.email);

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		return {
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				isVerified: user.isVerified,
				lastLogin: user.lastLogin
			},
			tokens: { accessToken, refreshToken }
		};
	}
}