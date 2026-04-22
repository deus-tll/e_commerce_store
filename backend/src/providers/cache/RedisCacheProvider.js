import Redis from "ioredis";
import {ICacheProvider} from "../../interfaces/cache/ICacheProvider.js";
import {config} from "../../config.js";

/**
 * Redis implementation of the ICacheProvider.
 * @augments ICacheProvider
 */
export class RedisCacheProvider extends ICacheProvider {
    #client;
    #isConnected = false;
    #uri;

    constructor() {
        super();
        this.#uri = config.providers.cache.redis.url;
    }

    async connect() {
        if (this.#client) return;

        this.#client = new Redis(this.#uri, {
            lazyConnect: true,
            maxRetriesPerRequest: 1,
            retryStrategy(times) {
                if (times > 3) return null;
                return Math.min(times * 100, 3000);
            }
        });

        this.#client.on("connect", () => {
            this.#isConnected = true;
            console.log("[Cache] Redis connected.");
        });

        this.#client.on("error", (err) => {
            this.#isConnected = false;
            console.error(`[Cache] Redis error: ${err.message}`);
        });

        await this.#client.connect();
    }

    async disconnect() {
        if (this.#client) {
            await this.#client.quit();
            console.log("[Cache] Redis disconnected.");
        }
    }

    async get(key) {
        if (!this.#isConnected) return null;

        const data = await this.#client.get(key);
        if (!data) return null;

        try {
            return JSON.parse(data);
        } catch (err) {
            console.warn(`[Cache] Redis failed to parse JSON for key "${key}":`, err.message);
            return data;
        }
    }

    async set(key, value, ttl) {
        if (!this.#isConnected) return;

        const data = JSON.stringify(value);
        if (ttl) await this.#client.set(key, data, "EX", ttl);
        else await this.#client.set(key, data);
    }

    async delete(key) {
        if (!this.#isConnected) return;
        await this.#client.del(key);
    }

    async quit() {
        await this.#client.quit();
    }
}