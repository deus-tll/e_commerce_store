import {Mongoose} from "mongoose";
import {IDatabaseProvider} from "./IDatabaseProvider.js";
import {getErrorMessage} from "../../../utils/error.js";

export class MongooseDatabaseProvider extends IDatabaseProvider {
    private readonly client: Mongoose;
    private readonly uri: string;
    private readonly isProduction: boolean;

    constructor(client: Mongoose, uri: string, isProduction: boolean) {
        super();
        this.client = client;
        this.uri = uri;
        this.isProduction = isProduction;

    }

    async connect(): Promise<void> {
        try {
            const conn = await this.client.connect(this.uri);
            console.log(`[Database] Mongoose connected: ${conn.connection.host}`);
        }
        catch (error: any) {
            console.error("[Database] Mongoose connection failed:", error.message);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        await this.client.disconnect();
        console.log("[Database] Mongoose disconnected.");
    }

    async drop(): Promise<void> {
        if (this.isProduction) {
            console.warn("[Database] Drop skipped: Production environment.");
            return;
        }

        try {
            if (this.client.connection.db) {
                console.log("[Database] Dropping Mongoose database...");
                await this.client.connection.db.dropDatabase();
                console.log("[Database] Mongoose database dropped.");
            }
        } catch (error: unknown) {
            console.error("[Database] Drop failed:", getErrorMessage(error));
        }
    }
}