import "dotenv/config";

export const config = {
	database: {
		mongoUri: process.env.MONGO_URI,
		redisUrl: process.env.REDIS_URL,
	},
	coupon: {
		discountPercentage: Number(process.env.COUPON_DISCOUNT_PERCENTAGE) || 10,
	}
};