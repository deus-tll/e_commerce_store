import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import {fileURLToPath} from "url";

import connectDB from "./infrastructure/db.js";

import errorHandler from "./http/middleware/errorHandlerMiddleware.js";

import {EnvModes} from "./constants/app.js";
import {RouterTypes, SeederTypes} from "./constants/ioc.js";
import {ServerPaths} from "./constants/file.js";
import {RouteTypes} from "./constants/api.js";
import {config} from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = config.nodeEnv;
const JSON_LIMIT = config.jsonLimit;

/**
 * Encapsulates the configuration and execution of the Express application.
 * Handles middleware setup, dependency injection for routers, database connection, and seeding.
 */
export class AppServer {
	/** @type {core.Express | Express} */ #app;
	/** @type {number | string} */ #port;
	/** @type {Container} */ #container;

	/**
	 * Initializes the server instance, configures middleware, and sets up routes.
	 * @param {Container} container - The IoC container instance.
	 */
	constructor(container) {
		this.#app = express();
		this.#port = config.port;
		this.#container = container;
	}

	/**
	 * Configures global middleware (CORS, body parsers, static files).
	 */
	configureMiddleware() {
		if (NODE_ENV !== EnvModes.PROD) {
			this.#app.use(
				cors({
					origin: config.developmentClientUrl,
					credentials: true,
				})
			);
		}

		this.#app.use(
			ServerPaths.STATIC_URL_PREFIX,
			express.static(path.join(__dirname, ServerPaths.STATIC_FOLDER_NAME))
		);

		this.#app.set('query parser', 'extended');
		this.#app.use(express.json({ limit: JSON_LIMIT }));
		this.#app.use(express.urlencoded({ limit: JSON_LIMIT, extended: true }));
		this.#app.use(cookieParser());
	}

	/**
	 * Configures the application routers, retrieving them from the IoC container.
	 */
	setupRoutes() {
		this.#app.use(RouteTypes.AUTH, this.#container.get(RouterTypes.AUTH));
		this.#app.use(RouteTypes.ANALYTICS, this.#container.get(RouterTypes.ANALYTICS));
		this.#app.use(RouteTypes.CART, this.#container.get(RouterTypes.CART));
		this.#app.use(RouteTypes.CATEGORY, this.#container.get(RouterTypes.CATEGORY));
		this.#app.use(RouteTypes.COUPON, this.#container.get(RouterTypes.COUPON));
		this.#app.use(RouteTypes.PAYMENT, this.#container.get(RouterTypes.PAYMENT));
		this.#app.use(RouteTypes.PRODUCT, this.#container.get(RouterTypes.PRODUCT));
		this.#app.use(RouteTypes.REVIEW, this.#container.get(RouterTypes.REVIEW));
		this.#app.use(RouteTypes.USER, this.#container.get(RouterTypes.USER));
	}

	/**
	 * Sets up error middleware.
	 */
	setupErrorHandling() {
		this.#app.use(errorHandler);
	}

	/**
	 * Executes seeding operations.
	 */
	async runSeeders() {
		const categorySeeder = this.#container.get(SeederTypes.CATEGORY);
		const adminSeeder = this.#container.get(SeederTypes.ADMIN);

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

			this.#container.verify();

			this.configureMiddleware();
			this.setupRoutes();
			this.setupErrorHandling();

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