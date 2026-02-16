import "dotenv/config";
import {EnvModes} from "./constants/app.js";

export const config = {
	port: process.env.PORT || 3001,
	jsonLimit: process.env.JSON_LIMIT || "10mb",
	appUrl: process.env.APP_URL,
	developmentClientUrl: process.env.DEVELOPMENT_CLIENT_URL || "http://localhost:5173",
	apiBaseUrl: process.env.API_BASE_URL || "/api",
	nodeEnv: process.env.NODE_ENV || EnvModes.DEV,
	database: {
		mongoUri: process.env.MONGO_URI,
		redisUrl: process.env.REDIS_URL,
	},
	storage: {
		cloudName: process.env.CLOUDINARY_CLOUD_NAME,
		apiKey: process.env.CLOUDINARY_API_KEY,
		apiSecret: process.env.CLOUDINARY_API_SECRET,
	},
	paymentProvider: {
		secretKey: process.env.STRIPE_SECRET_KEY,
		successUrl: process.env.STRIPE_SUCCESS_URL,
		cancelUrl: process.env.STRIPE_CANCEL_URL,
	},
	auth: {
		accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
		accessTokenTtl: process.env.ACCESS_TOKEN_TTL || "15m",
		refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
		refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || "7d",
		resetPasswordUrl: process.env.RESET_PASSWORD_URL
	},
	mail: {
		endpoint: process.env.MAILTRAP_ENDPOINT,
		token: process.env.MAILTRAP_TOKEN,
		senderEmail: process.env.MAILTRAP_SENDER_EMAIL,
		senderName: process.env.MAILTRAP_SENDER_NAME
	},
	coupon: {
		amountForGrantingCoupon: Number(process.env.TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS) || 20000,
		discountPercentage: Number(process.env.COUPON_DISCOUNT_PERCENTAGE) || 10
	},
	admin: {
		name: process.env.ADMIN_NAME,
		email: process.env.ADMIN_EMAIL,
		password: process.env.ADMIN_PASSWORD,
	}
};