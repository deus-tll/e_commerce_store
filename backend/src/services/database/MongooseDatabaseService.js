import mongoose from 'mongoose';
import {IDatabaseService} from "../../interfaces/database/IDatabaseService.js";
import {config} from "../../config.js";

/**
 * MongoDB implementation of the IDatabaseService using Mongoose.
 * @augments IDatabaseService
 */
export class MongooseDatabaseService extends IDatabaseService {
    #uri;

    constructor() {
        super();
        this.#uri = config.database.mongoUri;
    }

    async connect() {
        try {
            const conn = await mongoose.connect(this.#uri);
            console.log(`[Database] Mongoose connected: ${conn.connection.host}`);
            return conn;
        }
        catch (error) {
            console.error("[Database] Mongoose connection failed:", error.message);
            process.exit(1);
        }
    }

    async disconnect() {
        await mongoose.disconnect();
        console.log("[Database] Mongoose disconnected.");
    }

    async drop() {
        if (config.app.isProduction) {
            console.warn("[Database] Drop skipped: Production environment.");
            return;
        }

        try {
            console.log("[Database] Dropping Mongoose database...");
            await mongoose.connection.db.dropDatabase();
            console.log("[Database] Mongoose database dropped.");
        } catch (error) {
            console.error("[Database] Drop failed:", error.message);
        }
    }
}