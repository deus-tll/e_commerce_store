import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
	throw new Error("REDIS_URL environment variable is not set.");
}

export const redis = new Redis(redisUrl);

redis.on('error', (err) => {
	console.error(`[ioredis] Connection Error: ${err.message}`);
});