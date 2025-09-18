import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routers/auth.js";
import productsRouter from "./routers/products.js";
import categoriesRouter from "./routers/categories.js";
import cartRouter from "./routers/cart.js";
import couponsRouter from "./routers/coupons.js";
import paymentsRouter from "./routers/payments.js";
import analyticsRouter from "./routers/analytics.js";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandlerMiddleware.js";

const PORT = process.env.PORT || 3001;

const app = express();

if (process.env.NODE_ENV !== "production") {
	app.use(
		cors({
			origin: "http://localhost:5173",
			credentials: true,
		})
	);
}
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupons", couponsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/analytics", analyticsRouter);

app.use(errorHandler);

connectDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});