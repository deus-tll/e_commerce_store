import {Mongoose} from "mongoose";
import {IDatabaseProvider} from "./IDatabaseProvider.js";

/**
 * Mongoose implementation of the abstract contract for Database lifecycle management.
 */
export class MongooseDatabaseProvider extends IDatabaseProvider {
    private readonly mongoose: Mongoose;
    private readonly uri: string;
    private readonly isProduction: boolean;

    constructor(mongoose: Mongoose, uri: string, isProduction: boolean) {
        super();
        this.mongoose = mongoose;
        this.uri = uri;
        this.isProduction = isProduction;
    }

    async connect(): Promise<void> {
        try {
            const conn = await this.mongoose.connect(this.uri);
            console.log(`[Database] Mongoose connected: ${conn.connection.host}`);
        }
        catch (error: any) {
            console.error("[Database] Mongoose connection failed:", error.message);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        await this.mongoose.disconnect();
        console.log("[Database] Mongoose disconnected.");
    }

    async drop(): Promise<void> {
        if (this.isProduction) {
            console.warn("[Database] Drop skipped: Production environment.");
            return;
        }

        try {
            if (this.mongoose.connection.db) {
                console.log("[Database] Dropping Mongoose database...");
                await this.mongoose.connection.db.dropDatabase();
                console.log("[Database] Mongoose database dropped.");
            }
        } catch (error) {
            console.error("[Database] Drop failed:", error.message);
        }
    }
}