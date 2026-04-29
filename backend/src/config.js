import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

import {CacheTypes, EnvModes} from "./constants/app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../.env");

dotenv.config({
	path: envPath,
	override: true
});

const nodeEnv = process.env.NODE_ENV || EnvModes.DEV;
const isProduction = nodeEnv === EnvModes.PROD;
const port = Number(process.env.PORT) || 3001;

export const config = {
	app: {
		nodeEnv,
		isProduction,
		port,
		serverUrl: isProduction
			? process.env.APP_URL
			: `http://localhost:${port}`,
		clientUrl: isProduction
			? process.env.APP_URL
			: process.env.DEVELOPMENT_CLIENT_URL || "http://localhost:5173",
		apiBaseUrl: process.env.API_BASE_URL || "/api",
		jsonLimit: process.env.JSON_LIMIT || "10mb",
	},
	seeding: {
		defaultSeederUserPassword: process.env.DEFAULT_SEEDER_USER_PASSWORD,
		dummyJson: {
			productsUrl: process.env.DUMMY_JSON_PRODUCTS_URL,
			productsLimit: process.env.DUMMY_JSON_PRODUCTS_LIMIT
		}
	},
	providers: {
		database: {
			dropOnStartup: process.env.DROP_DB_ON_STARTUP === "true",
			mongo: {
				uri: process.env.MONGO_URI,
			}
		},
		cache: {
			type: process.env.CACHE_TYPE || CacheTypes.MEMORY,
			redis: {
				url: process.env.REDIS_URL
			}
		},
		storage: {
			dropOnStartup: process.env.DROP_STORAGE_ON_STARTUP === "true",
			cloudinary: {
				cloudName: process.env.CLOUDINARY_CLOUD_NAME,
				apiKey: process.env.CLOUDINARY_API_KEY,
				apiSecret: process.env.CLOUDINARY_API_SECRET,
			},
		},
		payment: {
			stripe: {
				secretKey: process.env.STRIPE_SECRET_KEY,
				successUrl: process.env.STRIPE_SUCCESS_URL,
				cancelUrl: process.env.STRIPE_CANCEL_URL,
				webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
			}
		},
		mail: {
			mailtrap: {
				endpoint: process.env.MAILTRAP_ENDPOINT,
				token: process.env.MAILTRAP_TOKEN,
				sender: {
					email: process.env.MAILTRAP_SENDER_EMAIL,
					name: process.env.MAILTRAP_SENDER_NAME,
				}
			}
		},
		password: {
			resetUrl: process.env.RESET_PASSWORD_URL,
			bcrypt: {
				saltRounds: Number(process.env.SALT_ROUNDS) || 10,
			}
		}
	},
	auth: {
		access: {
			secret: process.env.ACCESS_TOKEN_SECRET,
			ttl: process.env.ACCESS_TOKEN_TTL || "15m",
		},
		refresh: {
			secret: process.env.REFRESH_TOKEN_SECRET,
			ttl: process.env.REFRESH_TOKEN_TTL || "7d",
		}
	},
	business: {
		coupon: {
			minAmountForGrant: Number(process.env.TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS) || 20000,
			discountPercentage: Number(process.env.COUPON_DISCOUNT_PERCENTAGE) || 10,
		},
		initialAdmin: {
			name: process.env.ADMIN_NAME,
			email: process.env.ADMIN_EMAIL,
			password: process.env.ADMIN_PASSWORD,
		}
	}
};