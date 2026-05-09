import {IDatabaseProvider} from "../../interfaces/providers/database/IDatabaseProvider.js";

/**
 * MongoDB implementation of the IDatabaseProvider using Mongoose.
 * @augments IDatabaseProvider
 */
export class MongooseDatabaseProvider extends IDatabaseProvider {
    /** @type {import("mongoose").mongoose} */ #mongoose;
    /** @type {string} */ #uri;
    /** @type {boolean} */ #isProduction;

    /**
     * @param {import("mongoose").mongoose} mongoose
     * @param {string} uri
     * @param {boolean} isProduction
     */
    constructor(mongoose, uri, isProduction) {
        super();
        this.#mongoose = mongoose;
        this.#uri = uri;
        this.#isProduction = isProduction;
    }

    async connect() {
        try {
            const conn = await this.#mongoose.connect(this.#uri);
            console.log(`[Database] Mongoose connected: ${conn.connection.host}`);
            return conn;
        }
        catch (error) {
            console.error("[Database] Mongoose connection failed:", error.message);
            throw error;
        }
    }

    async disconnect() {
        await this.#mongoose.disconnect();
        console.log("[Database] Mongoose disconnected.");
    }

    async drop() {
        if (this.#isProduction) {
            console.warn("[Database] Drop skipped: Production environment.");
            return;
        }

        try {
            console.log("[Database] Dropping Mongoose database...");
            await this.#mongoose.connection.db.dropDatabase();
            console.log("[Database] Mongoose database dropped.");
        } catch (error) {
            console.error("[Database] Drop failed:", error.message);
        }
    }
}