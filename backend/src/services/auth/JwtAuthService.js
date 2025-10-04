import jwt from "jsonwebtoken";
import {redis} from "../../config/redis.js";

import {IAuthService} from "../../interfaces/IAuthService.js";

import {
	BadRequestError,
	InvalidCredentialsError,
	InvalidTokenError,
	TokenExpiredError
} from "../../errors/apiErrors.js";
import {TokenTypes} from "../../utils/constants.js";
import {MS_PER_DAY, MS_PER_HOUR, SECONDS_PER_DAY} from "../../utils/timeConstants.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL;
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL;

const APP_URL =
	process.env.NODE_ENV !== "production"
		? process.env.DEVELOPMENT_CLIENT_URL
		: process.env.APP_URL;

/**
 * @typedef {import('../../interfaces/user/IUserService.js').IUserService} IUserService
 * @typedef {import('../../interfaces/IEmailService').IEmailService} IEmailService
 */

/**
 * @typedef {object} UserDTO
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {boolean} isVerified
 * @property {Date} lastLogin
 * @property {Date} createdAt
 */

export class JwtAuthService extends IAuthService {
	/**
	 * @type {IUserService}
	 */
	userService;
	/**
	 * @type {IEmailService}
	 */
	emailService;

	/**
	 * @param {IUserService} userService
	 * @param {IEmailService} emailService
	 */
	constructor(userService, emailService) {
		super();
		this.userService = userService;
		this.emailService = emailService;
	}

	#userWithTokensResponse({ user, accessToken, refreshToken }) {
		return {
			user: this.userService.toDTO(user),
			tokens: { accessToken, refreshToken }
		};
	}

	#signAccessToken(userId) {
		return jwt.sign({userId}, ACCESS_TOKEN_SECRET, {
			expiresIn: ACCESS_TOKEN_TTL
		});
	}

	#signRefreshToken(userId) {
		return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
			expiresIn: REFRESH_TOKEN_TTL
		});
	}

	#generateTokens(userId) {
		const accessToken = this.#signAccessToken(userId);
		const refreshToken = this.#signRefreshToken(userId);

		return { accessToken, refreshToken };
	}

	async #storeRefreshToken(userId, refreshToken) {
		await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * SECONDS_PER_DAY);
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
		const user = await this.userService.create({
			name,
			email,
			password,
			role: "customer",
			isVerified: false
		});

		const verificationToken = this.emailService.generateVerificationToken();
		const verificationTokenExpiresAt = Date.now() + MS_PER_DAY;

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
		const user = await this.userService.getByEmail(email, {
			withPassword: true,
			throwIfNotFound: true
		});
		const userId = user._id;

		const isMatch = await this.userService.comparePassword(user, password);

		if (!isMatch) {
			throw new InvalidCredentialsError("Invalid credentials");
		}

		const { accessToken, refreshToken } = this.#generateTokens(userId);
		await this.#storeRefreshToken(userId, refreshToken);

		await this.userService.updateLastLogin(userId);

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
		const user = await this.userService.getById(userId);
		return this.userService.toDTO(user);
	}

	async validateAccessToken(token) {
		const decoded = await this.#verifyToken(token, process.env.ACCESS_TOKEN_SECRET, TokenTypes.ACCESS_TOKEN);

		const user = await this.userService.getById(decoded.userId, {
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

		await this.userService.getById(decoded.userId);

		const accessToken = this.#signAccessToken(decoded.userId);

		return { accessToken };
	}

	async verifyEmail(code) {
		const user = await this.userService.verify(code);

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		return this.#userWithTokensResponse({ user, accessToken, refreshToken });
	}

	async resendVerificationEmail(userId) {
		const user = await this.userService.getById(userId);

		if (user.isVerified) {
			throw new BadRequestError("Email is already verified");
		}

		const verificationToken = this.emailService.generateVerificationToken();
		const verificationTokenExpiresAt = Date.now() + MS_PER_DAY;

		await this.userService.setVerificationToken(
			userId,
			verificationToken,
			verificationTokenExpiresAt
		);

		await this.emailService.sendVerificationEmail(user.email, verificationToken);

		return { message: "Verification code sent to your email" };
	}

	async forgotPassword(email) {
		const user = await this.userService.getByEmail(email, {
			throwIfNotFound: true
		});

		const resetToken = this.emailService.generateResetToken();
		const resetPasswordTokenExpiresAt = Date.now() + MS_PER_HOUR;

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
		const user = await this.userService.resetPassword(token, password);

		await this.emailService.sendPasswordResetSuccessEmail(user.email);

		const { accessToken, refreshToken } = this.#generateTokens(user._id);
		await this.#storeRefreshToken(user._id, refreshToken);

		return this.#userWithTokensResponse({ user, accessToken, refreshToken });
	}

	async invalidateAllSessions(userId) {
		await this.#removeRefreshToken(userId);
	}

	async changePassword(userId, currentPassword, newPassword) {
		const user = await this.userService.getById(userId, {
			withPassword: true
		});

		const isMatch = await this.userService.comparePassword(user, currentPassword);

		if (!isMatch) {
			throw new InvalidCredentialsError("Current password is incorrect");
		}

		await this.userService.changePassword(user, newPassword);

		await this.invalidateAllSessions(userId);

		return { message: "Password changed successfully" };
	}
}