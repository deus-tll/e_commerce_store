import mongoose from 'mongoose';
import {config} from "../config.js";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(config.database.mongoUri);
		console.log(`[Database] Connected successfully! Host: ${conn.connection.host}`);
	}
	catch (error) {
		console.error("[Database] Connection failed!", error.message);
		process.exit(1);
	}
};

export const dropDatabase = async () => {
	if (config.app.isProduction) {
		console.warn("[Database] Drop database skipped: Production environment detected.");
		return;
	}

	try {
		console.log("[Database] Dropping database...");
		await mongoose.connection.db.dropDatabase();
		console.log("[Database] Database dropped successfully.");
	} catch (error) {
		console.error("[Database] Failed to drop database:", error.message);
	}
}