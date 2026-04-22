import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import {fileURLToPath} from "url";

import errorHandler from "./http/middleware/errorHandlerMiddleware.js";

import {ProviderTypes, RouterTypes, SeederTypes, ServiceTypes} from "./constants/ioc.js";
import {ServerPaths} from "./constants/file.js";
import {RouteTypes} from "./constants/api.js";
import {config} from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_LIMIT = config.app.jsonLimit;

/**
 * Encapsulates the configuration and execution of the Express application.
 * Handles middleware setup, dependency injection for routers, database connection, and seeding.
 */
export class AppServer {
	/** @type {core.Express | Express} */ #app;
	/** @type {number | string} */ #port;
	/** @type {Container} */ #container;
	/** @type {IDatabaseProvider} */ #db;
	/** @type {ICacheProvider} */ #cache;

	/**
	 * Initializes the server instance, configures middleware, and sets up routes.
	 * @param {Container} container - The IoC container instance.
	 */
	constructor(container) {
		this.#app = express();
		this.#port = config.app.port;
		this.#container = container;
		this.#db = this.#container.get(ServiceTypes.DATABASE);
		this.#cache = this.#container.get(ProviderTypes.CACHE);
	}

	/**
	 * Configures global middleware (CORS, body parsers, static files).
	 */
	configureMiddleware() {
		if (!config.app.isProduction) {
			this.#app.use(
				cors({
					origin: config.app.clientUrl,
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
	 * Configures webhook routes that must bypass global JSON parsing.
	 */
	configureExternalWebhooks() {
		this.#app.use(
			RouteTypes.PAYMENT,
			this.#container.get(RouterTypes.PAYMENT_WEBHOOK)
		);
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
		this.#app.use(RouteTypes.ORDER, this.#container.get(RouterTypes.ORDER));
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
		const adminSeeder = this.#container.get(SeederTypes.ADMIN);
		const dummyProductsSeeder = this.#container.get(SeederTypes.PRODUCTS_DUMMY_JSON);

		console.log("[Server] Starting seeders...");
		await adminSeeder.seed();
		await dummyProductsSeeder.seed();
		console.log("[Server] Seeding complete.");
	}

	async dropDatabase() {
		if (config.database.dropOnStartup) {
			await this.#db.drop();
		}
		else {
			console.log("[Database] Skipping drop.");
		}
	}

	async dropStorage() {
		if (config.services.storage.dropOnStartup) {
			const storageService = this.#container.get(ProviderTypes.STORAGE);
			await storageService.deleteAll();
		}
		else {
			console.log("[Storage] Skipping drop.");
		}
	}

	/**
	 * Configures and starts the server.
	 */
	async start() {
		try {
			await this.#db.connect()

			try {
				await this.#cache.connect();
			}
			catch (error) {
				if (config.app.isProduction) throw error;
				console.warn(`[Server] Cache not available: ${error.message}`);
			}

			// only works in development and with DROP_DB_ON_STARTUP=true in .env
			await this.dropDatabase();
			// only works in development and with DROP_STORAGE_ON_STARTUP=true in .env
			await this.dropStorage();

			this.#container.verify();

			this.configureExternalWebhooks();
			this.configureMiddleware();
			this.setupRoutes();
			this.setupErrorHandling();

			await this.runSeeders();

			this.#app.listen(this.#port, () => {
				console.log(`[Server] Running on port ${this.#port}`);
				console.log(`[Server] Environment: ${config.app.nodeEnv}`);
			});
		} catch (error) {
			console.error("[Server] Fatal error during server startup:", error);
			process.exit(1);
		}
	}

	/**
	 * Gracefully shuts down the server
	 */
	async stop() {
		console.log("[Server] Shutting down...");

		try {
			await Promise.allSettled([
				this.#db.disconnect(),
				this.#cache.disconnect()
			]);

			console.log("[Server] Cleanup complete. Exiting.");
			process.exit(0);
		}
		catch (error) {
			console.error("[Server] Error during shutdown:", error);
			process.exit(1);
		}
	}
}