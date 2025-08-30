import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import authRouter from "./routers/auth.js"
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", authRouter);

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});