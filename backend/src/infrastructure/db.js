import mongoose from 'mongoose';
import {config} from "../config.js";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(config.database.mongoUri);
		console.log(`[Database] Connected successfully! Host: ${conn.connection.host}`);
	}
	catch (error) {
		console.error("[Database] Connection failed!", error.message);
		process.exit(1);
	}
};

export default connectDB;