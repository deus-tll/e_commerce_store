import Redis from "ioredis";
import {config} from "../config.js";

const redisUrl = config.database.redisUrl;

if (!redisUrl) {
	throw new Error("REDIS_URL environment variable is not set.");
}

export const redis = new Redis(redisUrl);

redis.on('error', (err) => {
	console.error(`[Redis] Connection Error: ${err.message}`);
});