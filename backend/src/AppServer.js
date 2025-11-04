import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import {fileURLToPath} from "url";

import connectDB from "./config/db.js";
import {DependencyLocator} from "./core/ioc/DependencyLocator.js";

import errorHandler from "./http/middleware/errorHandlerMiddleware.js";

import {RouterTypes, SeederTypes} from "./utils/iocConstants.js";
import {EnvModes, ServerPaths} from "./utils/constants.js";
import {RouteTypes} from "./utils/apiConstants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || EnvModes.DEV;
const DEVELOPMENT_CLIENT_URL = process.env.DEVELOPMENT_CLIENT_URL || "http://localhost:5173";
const PORT = process.env.PORT || 3001;
const JSON_LIMIT = process.env.JSON_LIMIT || "10mb";

/**
 * Encapsulates the configuration and execution of the Express application.
 * Handles middleware setup, dependency injection for routers, database connection, and seeding.
 */
export class AppServer {
	/** @type {core.Express | Express} */ #app;
	/** @type {number | string} */ #port;

	/**
	 * Initializes the server instance, configures middleware, and sets up routes.
	 */
	constructor() {
		this.#app = express();
		this.#port = PORT;
		this.configureMiddleware();
		this.setupRoutes();
		this.#app.use(errorHandler);
	}

	/**
	 * Configures global middleware (CORS, body parsers, static files).
	 */
	configureMiddleware() {
		if (NODE_ENV !== EnvModes.PROD) {
			this.#app.use(
				cors({
					origin: DEVELOPMENT_CLIENT_URL,
					credentials: true,
				})
			);
		}

		this.#app.use(
			ServerPaths.STATIC_URL_PREFIX,
			express.static(path.join(__dirname, ServerPaths.STATIC_FOLDER_NAME))
		);

		this.#app.use(express.json({ limit: JSON_LIMIT }));
		this.#app.use(express.urlencoded({ extended: false }));
		this.#app.use(cookieParser());
	}

	/**
	 * Configures the application routers, retrieving them from the IoC container.
	 */
	setupRoutes() {
		this.#app.use(RouteTypes.AUTH, DependencyLocator.getRouter(RouterTypes.AUTH));
		this.#app.use(RouteTypes.ANALYTICS, DependencyLocator.getRouter(RouterTypes.ANALYTICS));
		this.#app.use(RouteTypes.CART, DependencyLocator.getRouter(RouterTypes.CART));
		this.#app.use(RouteTypes.CATEGORY, DependencyLocator.getRouter(RouterTypes.CATEGORY));
		this.#app.use(RouteTypes.COUPON, DependencyLocator.getRouter(RouterTypes.COUPON));
		this.#app.use(RouteTypes.PAYMENT, DependencyLocator.getRouter(RouterTypes.PAYMENT));
		this.#app.use(RouteTypes.PRODUCT, DependencyLocator.getRouter(RouterTypes.PRODUCT));
		this.#app.use(RouteTypes.REVIEW, DependencyLocator.getRouter(RouterTypes.REVIEW));
		this.#app.use(RouteTypes.USER, DependencyLocator.getRouter(RouterTypes.USER));
	}

	/**
	 * Executes seeding operations.
	 */
	async runSeeders() {
		const categorySeeder = DependencyLocator.getSeeder(SeederTypes.CATEGORY);
		const adminSeeder = DependencyLocator.getSeeder(SeederTypes.ADMIN);

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

			this.#app.listen(this.#port, () => {
				console.log(`Server is running on port ${this.#port}`);
				console.log(`Environment: ${NODE_ENV}`);
			});
		} catch (error) {
			console.error("Fatal error during server startup:", error);
			process.exit(1);
		}
	}
}