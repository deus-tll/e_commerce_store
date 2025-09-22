import jwt from "jsonwebtoken";
import {redis} from "../config/redis.js";

import {UserService} from "./UserService.js";
import {EmailService} from "./EmailService.js";

import {
	BadRequestError,
	InvalidCredentialsError,
	InvalidTokenError,
	TokenExpiredError
} from "../errors/apiErrors.js";
import {TokenTypes} from "../utils/constants.js";

const APP_URL =
	process.env.NODE_ENV !== "production"
		? process.env.DEVELOPMENT_CLIENT_URL
		: process.env.APP_URL;

export class AuthService {
	constructor() {
		this.userService = new UserService();
		this.emailService = new EmailService();
	}

	#userWithTokensResponse({ user, accessToken, refreshToken }) {
		return {
			user: this.userService.toDTO(user),
			tokens: { accessToken, refreshToken }
		};
	}

	#signAccessToken(userId) {
		return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
			expiresIn: "15m"
		});
	}

	#signRefreshToken(userId) {
		return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
			expiresIn: "7d"
		});
	}

	#generateTokens(userId) {
		const accessToken = this.#signAccessToken(userId);
		const refreshToken = this.#signRefreshToken(userId);

		return { accessToken, refreshToken };
	}

	async #storeRefreshToken(userId, refreshToken) {
		await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
	}

	async #removeRefreshToken(userId) {
		await redis.del(`refresh_token:${userId}`);
	}

	async #verifyToken(token, secret, type) {
		try {
			return jwt.verify(token, secret)
		}
		catch (error) {
			if (error.name === 'TokenExpiredError') {
				switch (type) {
					case TokenTypes.ACCESS_TOKEN:
						throw new TokenExpiredError("Access token expired");
					case TokenTypes.REFRESH_TOKEN:
						throw new TokenExpiredError("Refresh token expired");
				}
			}
			switch (type) {
				case TokenTypes.ACCESS_TOKEN:
					throw new InvalidTokenError("Invalid access token");
				case TokenTypes.REFRESH_TOKEN:
					throw new InvalidTokenError("Invalid refresh token");
			}
		}
	}

	async signup(name, email, password) {
		const user = await this.userService.createUser({
			name,
			email,
			password,
			role: "customer",
			isVerified: false
		});

		const verificationToken = this.emailService.generateVerificationToken();
		const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

		await this.userService.setVerificationToken(
			user._id,
			verificationToken,
			verificationTokenExpiresAt
		);

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		await this.emailService.sendVerificationEmail(email, verificationToken);

		return this.#userWithTokensResponse({ user, accessToken, refreshToken });
	}

	async login(email, password) {
		const user = await this.userService.getUserByEmail(email, {
			withPassword: true,
			throwIfNotFound: true
		});

		if (!(await user.comparePassword(password))) {
			throw new InvalidCredentialsError("Invalid credentials");
		}

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		await this.userService.updateLastLogin(user._id);

		return this.#userWithTokensResponse({ user, accessToken, refreshToken });
	}

	async logout(refreshToken) {
		if (refreshToken) {
			try {
				const decoded = await this.#verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET, TokenTypes.REFRESH_TOKEN);
				await this.#removeRefreshToken(decoded.userId);
			}
			catch (error) {
				console.warn("Invalid refresh token during logout:", error.message);
			}
		}
	}

	async getProfile(userId) {
		const user = await this.userService.getUserById(userId);
		return this.userService.toDTO(user);
	}

	async validateAccessToken(token) {
		const decoded = await this.#verifyToken(token, process.env.ACCESS_TOKEN_SECRET, TokenTypes.ACCESS_TOKEN);

		const user = await this.userService.getUserById(decoded.userId, {
			throwIfNotFound: false
		});

		if (!user) {
			throw new InvalidTokenError("User not found");
		}

		return { userId: decoded.userId, user };
	}

	async refreshAccessToken(refreshToken) {
		if (!refreshToken) {
			throw new InvalidTokenError("No refresh token provided");
		}

		const decoded = await this.#verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET, TokenTypes.REFRESH_TOKEN);

		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			throw new InvalidTokenError("Refresh token not found or revoked");
		}

		await this.userService.getUserById(decoded.userId);

		const accessToken = this.#signAccessToken(decoded.userId);

		return { accessToken };
	}

	async verifyEmail(code) {
		const user = await this.userService.verifyUser(code);

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		return this.#userWithTokensResponse({ user, accessToken, refreshToken });
	}

	async resendVerificationEmail(userId) {
		const user = await this.userService.getUserById(userId);

		if (user.isVerified) {
			throw new BadRequestError("Email is already verified");
		}

		const verificationToken = this.emailService.generateVerificationToken();
		const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

		await this.userService.setVerificationToken(
			userId,
			verificationToken,
			verificationTokenExpiresAt
		);

		await this.emailService.sendVerificationEmail(user.email, verificationToken);

		return { message: "Verification code sent to your email" };
	}

	async forgotPassword(email) {
		const user = await this.userService.getUserByEmail(email, {
			throwIfNotFound: true
		});

		const resetToken = this.emailService.generateResetToken();
		const resetPasswordTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

		await this.userService.setResetPasswordToken(
			user._id,
			resetToken,
			resetPasswordTokenExpiresAt
		);

		const resetPasswordUrl = `${APP_URL}/reset-password/${resetToken}`;

		await this.emailService.sendPasswordResetEmail(email, resetPasswordUrl);

		return {
			message: "Password reset link sent to your email"
		};
	}

	async resetPassword(token, password) {
		const user = await this.userService.resetUserPassword(token, password);

		await this.emailService.sendPasswordResetSuccessEmail(user.email);

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		return this.#userWithTokensResponse({ user, accessToken, refreshToken });
	}

	async invalidateAllSessions(userId) {
		await this.#removeRefreshToken(userId);
	}

	async changePassword(userId, currentPassword, newPassword) {
		const user = await this.userService.getUserById(userId, {
			withPassword: true
		});

		if (!(await user.comparePassword(currentPassword))) {
			throw new InvalidCredentialsError("Current password is incorrect");
		}

		await this.userService.changePassword(user, newPassword);

		await this.invalidateAllSessions(userId);

		return { message: "Password changed successfully" };
	}
}