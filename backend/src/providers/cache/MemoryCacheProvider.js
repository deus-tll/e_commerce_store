import {ICacheProvider} from "../../interfaces/cache/ICacheProvider.js";

/**
 * Simple in-memory cache implementation of the ICacheProvider.
 * @augments ICacheProvider
 */
export class MemoryCacheProvider extends ICacheProvider {
    #storage = new Map();

    async connect() {
        console.log("[MemoryCache] Initialized (In-memory storage).");
        return Promise.resolve();
    }

    async get(key) {
        return this.#storage.get(key) || null;
    }

    async set(key, value, ttl) {
        this.#storage.set(key, value);
    }

    async delete(key) {
        this.#storage.delete(key);
    }

    async disconnect() {
        this.#storage.clear();
        return Promise.resolve();
    }
}