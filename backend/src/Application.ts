import express, {Express} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import {DIContainer} from "./core/di/DIContainer.js";

import {setupAppRouters} from "./http/routers/index.js";
import {setupPaymentWebhookRouter} from "./http/routers/payment.webhook.js";
import errorHandler from "./http/middleware/errorHandler.js";

import {ApplicationServiceTypes, ControllerTypes, ProviderTypes, SeederTypes} from "./constants/ioc.js";
import {config} from "./config.js";

const JSON_LIMIT = config.server.jsonLimit;
const API_BASE = config.server.apiBaseUrl;

/**
 * Encapsulates the configuration and execution of the Express application.
 */
export class Application {
	private readonly app: Express;
	private readonly port: number | string;
	private readonly dependencies: any;
	private readonly container: DIContainer;

	constructor(container: DIContainer) {
		this.app = express();
		this.port = config.server.port;
		this.dependencies = this.resolveDependencies(container);
		this.container = container;
	}

	private resolveDependencies(container :DIContainer) {
		return {
			database: container.get(ProviderTypes.DATABASE),
			cache: container.get(ProviderTypes.CACHE),
			storage: container.get(ProviderTypes.STORAGE),

			authService: container.get(ApplicationServiceTypes.SESSION_AUTH),

			analyticsController: container.get(ControllerTypes.ANALYTICS),
			authController: container.get(ControllerTypes.AUTH),
			cartController: container.get(ControllerTypes.CART),
			categoryController: container.get(ControllerTypes.CATEGORY),
			couponController: container.get(ControllerTypes.COUPON),
			orderController: container.get(ControllerTypes.ORDER),
			paymentController: container.get(ControllerTypes.PAYMENT),
			productController: container.get(ControllerTypes.PRODUCT),
			reviewController: container.get(ControllerTypes.REVIEW),
			userController: container.get(ControllerTypes.USER),

			adminSeeder: container.get(SeederTypes.ADMIN),
			dummyProductsSeeder: container.get(SeederTypes.PRODUCTS_DUMMY_JSON)
		};
	}

	/**
	 * Configures global middleware (CORS, body parsers, static files).
	 */
	configureMiddleware() {
		this.app.use(
			cors({
				origin: config.server.clientUrl,
				credentials: true,
			})
		);

		this.app.set('query parser', 'extended');
		this.app.use(express.json({ limit: JSON_LIMIT }));
		this.app.use(express.urlencoded({ limit: JSON_LIMIT, extended: true }));
		this.app.use(cookieParser());
	}

	/**
	 * Sets up webhook routes that must bypass global JSON parsing.
	 */
	setupWebhookRoutes() {
		const webhookRouter = setupPaymentWebhookRouter(this.dependencies.paymentController);
		this.app.use("/api/payments/webhook", webhookRouter);
	}

	setupRoutes() {
		this.app.get("/", (_, res) => {
			res.status(200).send("OK")
		})

		this.app.use(API_BASE, setupAppRouters(this.dependencies));
	}

	setupErrorHandling() {
		this.app.use(errorHandler);
	}

	async runSeeders() {
		console.log("[Server] Starting seeders...");

		await this.dependencies.adminSeeder.seed();

		if (config.seeding.seedProductsOnStartup) {
			await this.dependencies.dummyProductsSeeder.seed();
		}

		console.log("[Server] Seeding complete.");
	}

	async dropDatabase() {
		if (config.infrastructure.providers.database.dropOnStartup) {
			await this.dependencies.database.drop();
		}
		else {
			console.log("[Database] Skipping drop.");
		}
	}

	async dropStorage() {
		if (config.infrastructure.providers.storage.dropOnStartup) {
			await this.dependencies.storage.deleteAll();
		}
		else {
			console.log("[Storage] Skipping drop.");
		}
	}

	async start() {
		try {
			await this.dependencies.database.connect()

			try {
				await this.dependencies.cache.connect();
			}
			catch (error) {
				if (config.server.isProduction) throw error;
				console.warn(`[Server] Cache not available: ${error.message}`);
			}

			// only works in development and with DROP_DB_ON_STARTUP=true in .env
			await this.dropDatabase();
			// only works in development and with DROP_STORAGE_ON_STARTUP=true in .env
			await this.dropStorage();

			this.container.verify();

			this.setupWebhookRoutes();
			this.configureMiddleware();
			this.setupRoutes();
			this.setupErrorHandling();

			await this.runSeeders();

			this.app.listen(this.port, () => {
				console.log(`[Server] Running on port ${this.port}`);
				console.log(`[Server] Environment: ${config.server.nodeEnv}`);
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
				this.dependencies.database.disconnect(),
				this.dependencies.cache.disconnect()
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