import mongoose from 'mongoose';
import {config} from "../config.js";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(config.database.mongoUri);
		console.log(`Connected to the database! Host: ${conn.connection.host}`);
	}
	catch (error) {
		console.error("Connection to the database failed!", error.message);
		process.exit(1);
	}
};

export default connectDB;