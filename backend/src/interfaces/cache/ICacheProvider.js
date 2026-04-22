/**
 * @interface ICacheProvider
 * @description Defines the contract for in-memory database management
 */
export class ICacheProvider {
    /**
     * Establishes connection to the cache storage.
     * @returns {Promise<void>}
     */
    async connect() { throw new Error("Not implemented"); }

    /**
     * Closes the cache connection.
     * @returns {Promise<void>}
     */
    async disconnect() { throw new Error("Not implemented"); }

    /**
     * Retrieves a value from cache.
     * @param {string} key
     * @returns {Promise<string | null>}
     */
    async get(key) { throw new Error("Not implemented"); }

    /**
     * Stores a value in cache with an optional expiration time.
     * @param {string} key
     * @param {*} value
     * @param {number} [ttl] - Time to live in seconds.
     * @returns {Promise<void>}
     */
    async set(key, value, ttl) { throw new Error("Not implemented"); }

    /**
     * Deletes a key from Cache.
     * @param {string} key
     * @returns {Promise<void>}
     */
    async delete(key) { throw new Error("Not implemented"); }
}