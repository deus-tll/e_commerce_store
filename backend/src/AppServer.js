import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import {fileURLToPath} from "url";

import container from "./config/dependencyContainer.js";
import {getRouter} from "./utils/iocHelpers.js";

import productsRouter from "./routers/products.js";
import categoriesRouter from "./routers/categories.js";
import cartRouter from "./routers/cart.js";
import couponsRouter from "./routers/coupons.js";
import paymentsRouter from "./routers/payments.js";
import analyticsRouter from "./routers/analytics.js";
import reviewsRouter from "./routers/reviews.js";

import errorHandler from "./middleware/errorHandlerMiddleware.js";
import connectDB from "./config/db.js";
import {CategorySeeder} from "./seeders/CategorySeeder.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Encapsulates the configuration and execution of the Express application.
 * Handles middleware setup, dependency injection for routers, database connection, and seeding.
 */
export class AppServer {
	/**
	 * @type {core.Express | Express}
	 */
	app;

	/**
	 * @type {number | string}
	 */
	port;

	/**
	 * Initializes the server instance, configures middleware, and sets up routes.
	 */
	constructor() {
		this.app = express();
		this.port = process.env.PORT || 3001;
		this.configureMiddleware();
		this.setupRoutes();
		this.app.use(errorHandler);
	}

	/**
	 * Configures global middleware (CORS, body parsers, static files).
	 */
	configureMiddleware() {
		if (process.env.NODE_ENV !== "production") {
			this.app.use(
				cors({
					origin: "http://localhost:5173",
					credentials: true,
				})
			);
		}

		this.app.use("/public", express.static(path.join(__dirname, "../public")));

		this.app.use(express.json({ limit: "10mb" }));
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(cookieParser());
	}

	/**
	 * Configures the application routers, retrieving them from the IoC container
	 * or using external imports for non-refactored modules.
	 */
	setupRoutes() {
		const authRouter = getRouter(container, "authRouter");
		const usersRouter = getRouter(container, "usersRouter");

		this.app.use("/api/auth", authRouter);
		this.app.use("/api/users", usersRouter);

		this.app.use("/api/products", productsRouter);
		this.app.use("/api/categories", categoriesRouter);
		this.app.use("/api/cart", cartRouter);
		this.app.use("/api/coupons", couponsRouter);
		this.app.use("/api/payments", paymentsRouter);
		this.app.use("/api/analytics", analyticsRouter);
		this.app.use("/api/reviews", reviewsRouter);
	}

	/**
	 * Executes seeding operations.
	 */
	async runSeeders() {
		const categorySeeder = new CategorySeeder();

		const adminSeeder = container.get('AdminSeeder');

		console.log("Starting seeders...");
		await categorySeeder.seed();
		await adminSeeder.seed();
		console.log("Seeding complete.");
	}

	/**
	 * Connects to the database, runs seeders, and starts the Express server.
	 */
	async start() {
		try {
			await connectDB();

			await this.runSeeders();

			this.app.listen(this.port, () => {
				console.log(`Server is running on port ${this.port}`);
				console.log(`Environment: ${process.env.NODE_ENV}`);
			});
		} catch (error) {
			console.error("Fatal error during server startup:", error);
			process.exit(1);
		}
	}
}