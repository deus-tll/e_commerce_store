import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

import {EnvMode} from "./enums/server.js";
import {CacheType, EmailType} from "./enums/infrastructure.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath, override: true });

const parseBool = (val: string | undefined): boolean => val === "true";
const parseNum = (val: string | undefined, fallback: number): number => {
	const parsed = Number(val);
	return isNaN(parsed) ? fallback : parsed;
};
const requiredEnv = (name: string): string => {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
};

const nodeEnv = process.env.NODE_ENV || EnvMode.DEV;
const isProduction = nodeEnv === EnvMode.PROD;
const port = parseNum(process.env.PORT, 3001);

export const config = {
	server: {
		nodeEnv: nodeEnv,
		isProduction: isProduction,
		port: port,
		appName: process.env.APP_NAME,
		clientUrl: isProduction
			? requiredEnv("PRODUCTION_CLIENT_URL")
			: process.env.DEVELOPMENT_CLIENT_URL || "http://localhost:5173",
		apiBaseUrl: process.env.API_BASE_URL || "/api",
		passwordResetUrl: requiredEnv("RESET_PASSWORD_URL"),
		jsonLimit: process.env.JSON_LIMIT || "10mb",
		forceDisableSecureCookies: parseBool(process.env.FORCE_DISABLE_SECURE_COOKIES)
	},
	infrastructure: {
		providers: {
			database: {
				dropOnStartup: parseBool(process.env.DROP_DB_ON_STARTUP),
				mongo: {
					uri: isProduction
						? requiredEnv("PRODUCTION_MONGO_URI")
						: requiredEnv("DEVELOPMENT_MONGO_URI"),
				}
			},
			cache: {
				type: process.env.CACHE_TYPE || CacheType.MEMORY,
				redis: {
					url: isProduction
						? requiredEnv("PRODUCTION_REDIS_URL")
						: requiredEnv("DEVELOPMENT_REDIS_URL"),
				}
			},
			storage: {
				dropOnStartup: parseBool(process.env.DROP_STORAGE_ON_STARTUP),
				cloudinary: {
					cloudName: requiredEnv("CLOUDINARY_CLOUD_NAME"),
					apiKey: requiredEnv("CLOUDINARY_API_KEY"),
					apiSecret: requiredEnv("CLOUDINARY_API_SECRET"),
				},
			},
			payment: {
				stripe: {
					secretKey: requiredEnv("STRIPE_SECRET_KEY"),
					webhookSecret: requiredEnv("STRIPE_WEBHOOK_SECRET"),
					successUrl: requiredEnv("STRIPE_SUCCESS_URL"),
					cancelUrl: requiredEnv("STRIPE_CANCEL_URL"),
				}
			},
			email: {
				type: process.env.EMAIL_TYPE || EmailType.NODEMAILER,
				senderName: requiredEnv("MAIL_SENDER_NAME"),
				mailtrap: {
					token: requiredEnv("MAILTRAP_TOKEN"),
					sender: {
						email: requiredEnv("MAILTRAP_SENDER_EMAIL"),
						name: requiredEnv("MAILTRAP_SENDER_NAME"),
					}
				},
				gmail: {
					user: requiredEnv("GMAIL_USER"),
					pass: requiredEnv("GMAIL_PASS"),
				}
			}
		},
		security: {
			bcrypt: {
				saltRounds: parseNum(process.env.SALT_ROUNDS, 10),
			},
			jwt: {
				access: {
					secret: requiredEnv("ACCESS_TOKEN_SECRET"),
					ttl: process.env.ACCESS_TOKEN_TTL || "15m",
				},
				refresh: {
					secret: requiredEnv("REFRESH_TOKEN_SECRET"),
					ttl: process.env.REFRESH_TOKEN_TTL || "7d",
				}
			}
		}
	},
	business: {
		coupon: {
			minAmountForGrant: parseNum(process.env.TOTAL_AMOUNT_FOR_GRANTING_COUPON_DISCOUNT_IN_CENTS, 20000),
			discountPercentage: parseNum(process.env.COUPON_DISCOUNT_PERCENTAGE, 10),
		},
		initialAdmin: {
			name: requiredEnv("ADMIN_NAME"),
			email: requiredEnv("ADMIN_EMAIL"),
			password: requiredEnv("ADMIN_PASSWORD"),
		},
		product: {
			featuredProductsMinRating: parseNum(process.env.FEATURED_PRODUCTS_MIN_RATING, 4.5),
			recommendationsInCartSize: parseNum(process.env.RECOMMENDATIONS_IN_CART_SIZE, 4)
		},
		review : {
			requirePurchaseForReview: !parseBool(process.env.DISABLE_PURCHASE_FOR_REVIEW)
		}
	},
	seeding: {
		defaultSeederUserPassword: requiredEnv("DEFAULT_SEEDER_USER_PASSWORD"),
		seedProductsOnStartup: parseBool(process.env.SEED_PRODUCTS_ON_STARTUP),
		dummyJson: {
			productsUrlWithLimit: process.env.DUMMY_JSON_PRODUCTS_URL
				? `${process.env.DUMMY_JSON_PRODUCTS_URL}?limit=${parseNum(process.env.DUMMY_JSON_PRODUCTS_LIMIT, 10)}`
				: "https://dummyjson.com/products?limit=10",
		}
	},
};