import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`Connected to the database! Host: ${conn.connection.host}`);
	}
	catch (error) {
		console.log("Connection to the database failed!", error.message);
		process.exit(1);
	}
};

export default connectDB;