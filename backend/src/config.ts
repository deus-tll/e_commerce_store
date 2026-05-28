import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";

import {EnvMode} from "./enums/server.js";
import {CacheType} from "./enums/infrastructure.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath, override: true });

const parseBool = (val: string | undefined): boolean => val === "true";
const parseNum = (val: string | undefined, fallback: number): number => {
	const parsed = Number(val);
	return isNaN(parsed) ? fallback : parsed;
};

const nodeEnv = process.env.NODE_ENV || EnvMode.DEV;
const isProduction = nodeEnv === EnvMode.PROD;
const port = parseNum(process.env.PORT, 3001);

export const config = {
	server: {
		nodeEnv: nodeEnv,
		isProduction: isProduction,
		port: port,
		clientUrl: isProduction
			? process.env.PRODUCTION_CLIENT_URL
			: process.env.DEVELOPMENT_CLIENT_URL || "http://localhost:5173",
		apiBaseUrl: process.env.API_BASE_URL || "/api",
		passwordResetUrl: process.env.RESET_PASSWORD_URL,
		jsonLimit: process.env.JSON_LIMIT || "10mb",
		forceDisableSecureCookies: parseBool(process.env.FORCE_DISABLE_SECURE_COOKIES)
	},
	infrastructure: {
		providers: {
			database: {
				dropOnStartup: parseBool(process.env.DROP_DB_ON_STARTUP),
				mongo: {
					uri: isProduction
						? process.env.PRODUCTION_MONGO_URI
						: process.env.DEVELOPMENT_MONGO_URI,
				}
			},
			cache: {
				type: process.env.CACHE_TYPE || CacheType.MEMORY,
				redis: {
					url: isProduction
						? process.env.PRODUCTION_REDIS_URL
						: process.env.DEVELOPMENT_REDIS_URL,
				}
			},
			storage: {
				dropOnStartup: parseBool(process.env.DROP_STORAGE_ON_STARTUP),
				cloudinary: {
					cloudName: process.env.CLOUDINARY_CLOUD_NAME,
					apiKey: process.env.CLOUDINARY_API_KEY,
					apiSecret: process.env.CLOUDINARY_API_SECRET,
				},
			},
			payment: {
				stripe: {
					secretKey: process.env.STRIPE_SECRET_KEY,
					webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
					successUrl: process.env.STRIPE_SUCCESS_URL,
					cancelUrl: process.env.STRIPE_CANCEL_URL,
				}
			},
			mail: {
				mailtrap: {
					token: process.env.MAILTRAP_TOKEN,
					sender: {
						email: process.env.MAILTRAP_SENDER_EMAIL,
						name: process.env.MAILTRAP_SENDER_NAME,
					}
				}
			}
		},
		security: {
			bcrypt: {
				saltRounds: parseNum(process.env.SALT_ROUNDS, 10),
			},
			jwt: {
				access: {
					secret: process.env.ACCESS_TOKEN_SECRET,
					ttl: process.env.ACCESS_TOKEN_TTL || "15m",
				},
				refresh: {
					secret: process.env.REFRESH_TOKEN_SECRET,
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
			name: process.env.ADMIN_NAME,
			email: process.env.ADMIN_EMAIL,
			password: process.env.ADMIN_PASSWORD,
		},
		product: {
			featuredProductsMinRating: parseNum(process.env.FEATURED_PRODUCTS_MIN_RATING, 4.5),
			recommendationsInCartSize: parseNum(process.env.RECOMMENDATIONS_IN_CART_SIZE, 4)
		}
	},
	seeding: {
		defaultSeederUserPassword: process.env.DEFAULT_SEEDER_USER_PASSWORD,
		seedProductsOnStartup: parseBool(process.env.SEED_PRODUCTS_ON_STARTUP),
		dummyJson: {
			productsUrlWithLimit: process.env.DUMMY_JSON_PRODUCTS_URL
				? `${process.env.DUMMY_JSON_PRODUCTS_URL}?limit=${parseNum(process.env.DUMMY_JSON_PRODUCTS_LIMIT, 10)}`
				: "https://dummyjson.com/products?limit=10",
		}
	},
};